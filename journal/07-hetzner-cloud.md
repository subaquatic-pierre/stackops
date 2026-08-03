# Hetzner Cloud Infrastructure

## Overview

**Hetzner Cloud** is the centralized infrastructure-as-code monorepo for CODATIVITY. It serves as the single source of truth for provisioning servers, bootstrapping a Kubernetes cluster, deploying 17+ client applications via GitOps (ArgoCD), and configuring Nginx reverse-proxy routing on Hetzner Cloud.

- **Repository:** CODATIVITY/hetzner-cloud
- **Primary Tech:** Terraform, Ansible, Kubernetes (kubeadm), ArgoCD, Kustomize, Helm, Nginx

## Infrastructure

### Physical Servers (Hetzner Cloud)

| Server | Role | IP |
|--------|------|-----|
| `cdt-control` | Kubernetes control plane + Nginx | `5.75.209.114` |
| `cdt-worker` | Kubernetes worker node | `138.199.152.187` |
| `cdt-db` | Central database server (PostgreSQL, MongoDB, MySQL) | `49.13.67.140` |

### Managed Applications (17 projects)

| # | Application | Production Domain |
|---|-------------|-------------------|
| 1 | Codativity | `codativity.com` |
| 2 | Lukestays | `lukestays.com` |
| 3 | Champions Karate | `champions-uae.com` |
| 4 | Elemech | `elemech.ae` |
| 5 | RAKNYE | `raknye.com` |
| 6 | CarPass | `carpass.codaweb.co` |
| 7 | Planara | `planara.events` |
| 8 | Maven ERP | `erp.mavenpdc.cloud` |
| 9 | OxideAuth | `oxideauth.codaweb.co` |
| 10 | Booking Clinic | `booking.codaweb.co` |
| 11 | Busa Woodward | — |
| 12 | Sera Villas | — |
| 13 | Next Commerce (TCS) | `beta.thecraftsafari.shop` |
| 14 | Dubai Skate Academy | `dubaiskateacademy.codaweb.co` |
| 15 | RAKFSC | `rakfsc.codaweb.co` |
| 16 | Event App Demo | `event-app-demo.codaweb.co` |
| 17 | Planara Events | (additional overlay) |

## Layered Architecture

```
Layer 1: HETZNER CLOUD (Bare-Metal / VMs)
  ├── cdt-control (K8s control plane + Nginx)
  ├── cdt-worker  (K8s worker node)
  └── cdt-db      (PostgreSQL / MongoDB / MySQL)

Layer 2: ANSIBLE (Provisioning)
  ├── deps.yaml    → OS bootsrapping (containerd, kubelet, kubeadm)
  ├── control.yaml → kubeadm init + Flannel CNI
  └── worker.yaml  → kubeadm join

Layer 3: TERRAFORM (K8s Cluster Management)
  ├── Namespaces: argocd, sealed-secrets
  ├── Helm releases: ArgoCD, SealedSecrets
  ├── Node taints/labels for dedicated workloads
  └── ArgoCD ApplicationSet (auto-discovers gitops/namespaces/*/)

Layer 4: ARGOCD (GitOps Deployment)
  ├── Monitors gitops/namespaces/*/
  ├── Self-healing + auto-prune
  └── Slack notifications on sync

Layer 5: NGINX (Traffic Routing)
  ├── 21 site configs in sites-available/
  ├── Reverse proxies to K8s NodePort services (10.0.0.3:3xxxx)
  ├── SSL termination via Let's Encrypt
  └── Config synced via rsync

Layer 6: APPLICATIONS (Kubernetes Pods)
  ├── Deployments with NodePort Services
  ├── ConfigMaps + Secrets (via SealedSecrets)
  └── Environment-specific overlays via Kustomize
```

## Repository Structure

| Directory | Purpose |
|-----------|---------|
| `terraform/` | IaC: providers, ArgoCD ApplicationSet, node management |
| `ansible/` | Server config: deps, control plane init, worker join |
| `gitops/base/` | 11 application base K8s templates |
| `gitops/namespaces/` | 12 overlay directories with env-specific config |
| `nginx/` | 21 reverse proxy site configs |
| `maven/` | Maven ERP bare-metal resources (systemd, cloud-init) |
| `examples/` | CI/CD pipeline templates, Dockerfile, S3 config |
| `secrets/` | Excluded from Git — credentials, SSH keys, kubeconfig |
| `scripts/` | Python utility for S3-compatible storage management |

## Key Features

- **ArgoCD ApplicationSet:** Auto-generates K8s applications for every directory under `gitops/namespaces/*/`
- **Kustomize overlays:** `base/` + `namespaces/` pattern; production overlays add replicas, nodeSelector, tolerations, topologySpreadConstraints
- **Dedicated node pools:** Maven production uses `NoSchedule` taints for workload isolation
- **GitOps CI/CD:** Staging auto-deploys on tag push; production requires PR approval (gated deployment)
- **Slack notifications:** ArgoCD sends rich deployment status messages
- **Dual-mode deployment:** Apps can run in Kubernetes or as bare-metal Docker via systemd (Maven ERP)
- **SealedSecrets:** Kubernetes secrets encrypted for safe Git storage
- **Example templates:** Ready-to-copy CI/CD workflow, Dockerfile, and S3 config for new projects

## Tool Stack

| Tool | Role |
|------|------|
| **Terraform** | K8s-level cluster management (Helm, namespaces, secrets) |
| **Ansible** | Bare-metal OS and cluster provisioning |
| **Kubernetes v1.29** | Container orchestration (kubeadm, Flannel CNI) |
| **Helm** | ArgoCD and SealedSecrets deployment |
| **ArgoCD** | GitOps continuous delivery |
| **Kustomize** | Per-environment manifest customization |
| **Nginx** | Reverse proxy + SSL (Let's Encrypt) |
| **SealedSecrets** | Encrypted K8s secrets in Git |
| **GitHub Actions** | CI pipelines in individual app repos |
