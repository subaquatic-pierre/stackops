#!/usr/bin/env bash
#
# deploy.sh — Build the Docusaurus site and push a tag to trigger
# GitHub Actions deployment to GitHub Pages.
#
# Usage:
#   ./scripts/deploy.sh               # auto-increment patch version
#   ./scripts/deploy.sh minor         # bump minor version
#   ./scripts/deploy.sh major         # bump major version
#   ./scripts/deploy.sh v1.2.3          # use an explicit version tag
#
# The GitHub Actions workflow at .github/workflows/deploy.yml listens
# for tag pushes and handles the actual GitHub Pages deployment.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# ── helpers ────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # no color

log()  { printf "${GREEN}[deploy]${NC} %s\n" "$*"; }
warn() { printf "${YELLOW}[deploy] WARNING:${NC} %s\n" "$*" >&2; }
err()  { printf "${RED}[deploy] ERROR:${NC} %s\n" "$*" >&2; exit 1; }

# ── pre-flight checks ─────────────────────────────────────────────────

command -v node >/dev/null 2>&1 || err "Node.js is required but not found."
command -v npm  >/dev/null 2>&1 || err "npm is required but not found."
command -v git  >/dev/null 2>&1 || err "git is required but not found."

# Ensure we have a clean working tree (stash-check only — don't actually stash).
if ! git diff-index --quiet HEAD --; then
  warn "Working tree is dirty. Commit or stash changes before deploying."
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [ -z "$CURRENT_BRANCH" ]; then
  err "Not on any branch (detached HEAD). Checkout a branch first."
fi
log "Current branch: ${CURRENT_BRANCH}"

# ── determine tag ─────────────────────────────────────────────────────

latest_tag() {
  git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
}

LATEST="$(latest_tag)"
log "Latest tag: ${LATEST}"

YES=false

# Parse flags first
while [ $# -gt 0 ]; do
  case "$1" in
    -y|--yes) YES=true; shift ;;
    *)        break ;;
  esac
done

TAG=""

if [ $# -eq 0 ]; then
  # Default: bump patch version.
  # Strip a leading 'v' from the latest tag so we can parse semver.
  BASE="${LATEST#v}"
  MAJOR="${BASE%%.*}"
  REST="${BASE#*.}"
  MINOR="${REST%%.*}"
  PATCH="${REST#*.}"
  NEW_PATCH=$((PATCH + 1))
  TAG="v${MAJOR}.${MINOR}.${NEW_PATCH}"
elif [ $# -eq 1 ]; then
  case "$1" in
    major|minor|patch)
      # Let npm bump the version in package.json and return the new version.
      # (This also updates package-lock.json.)
      NEW_VERSION="$(npm version "$1" --no-git-tag-version)"
      TAG="${NEW_VERSION}"
      log "Bumped package.json version to ${NEW_VERSION}"
      ;;
    *)
      TAG="$1"
      ;;
  esac
else
  err "Too many arguments. Usage: ./scripts/deploy.sh [-y] [major|minor|patch|X.Y.Z]"
fi

log "Deployment tag will be: ${TAG}"

# ── confirm ───────────────────────────────────────────────────────────

if [ "${YES}" = false ]; then
  read -r -p "$(printf "${YELLOW}Proceed with deploy tag ${TAG}?${NC} [y/N] ")" CONFIRM </dev/tty
  if [ "${CONFIRM}" != "y" ] && [ "${CONFIRM}" != "Y" ]; then
    log "Aborted."
    exit 0
  fi
fi

# ── build ─────────────────────────────────────────────────────────────

log "Installing dependencies (npm ci)..."
npm ci

log "Running type-check..."
npm run typecheck

log "Building Docusaurus site..."
npm run build

log "Build completed successfully."

# ── tag & push ────────────────────────────────────────────────────────

log "Creating tag ${TAG}..."
git tag -a "${TAG}" -m "deploy: ${TAG}" 2>/dev/null || {
  warn "Tag ${TAG} already exists locally. Skipping tag creation."
}

log "Pushing tag ${TAG} to origin..."
git push origin "${TAG}"

# If the bump script modified package.json, commit that too.
if ! git diff --quiet package.json package-lock.json; then
  log "Committing version bump..."
  git add package.json package-lock.json
  git commit -m "chore: bump version to ${TAG}"
  git push origin "${CURRENT_BRANCH}"
fi

echo ""
log "Tag ${TAG} pushed. GitHub Actions will handle the deployment."
log "Monitor progress at: https://github.com/subaquatic-pierre/stackops/actions"
