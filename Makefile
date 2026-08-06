.PHONY: help deploy build clean

# ── helpers ────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

# ── targets ────────────────────────────────────────────────────────────

deploy: ## Build the Docusaurus site and deploy to GitHub Pages (via tag push)
	bash scripts/deploy.sh --yes $(filter-out $@,$(MAKECMDGOALS))

build: ## Build the Docusaurus site locally (production build)
	npm run build

clean: ## Remove build output and clear Docusaurus cache
	npm run clear
	rm -rf build

# ── passthrough for deploy args ────────────────────────────────────────
# Allow `make deploy minor` etc. to forward the bump-level argument.
%:
	@:
