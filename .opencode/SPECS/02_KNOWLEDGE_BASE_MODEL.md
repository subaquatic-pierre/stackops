# Knowledge Base Content Architecture

## 1. Core Philosophy: Flat & Fast

The Knowledge Base is designed as a hybrid "Cookbook & Reference" manual. It prioritizes low-friction authoring and extremely fast retrieval. 

**Strict Rule:** No nested sub-directories inside the top-level domain folders. The structure must remain flat.

## 2. Directory Structure

Folders are created strictly at the root of `/docs/` and represent primary tools, platforms, or broad domains.

```text
docs/
├── aws/
│   ├── iam-revoke-leaked-keys.mdx        # Actionable/Playbook
│   ├── vpc-architecture-overview.mdx     # Reference/Conceptual
│   └── ec2-get-instance-metadata.mdx     # Actionable
├── kubernetes/
│   ├── manifest-examples-deployments.mdx # Reference/Templates
│   └── force-delete-stuck-pod.mdx        # Actionable
└── linux/
    ├── common-config-locations.mdx       # Reference
    └── network-find-process-port.mdx     # Actionable
```

## 3. Content Types

Files within a domain folder can be one of two conceptual types, but they live side-by-side:
- **Actionable (Cookbook):** Goal-oriented recipes, incident response playbooks, copy-paste commands (e.g., `create-postgres-user.mdx`).
- **Reference (Encyclopedia):** Explanations of architectures, typical config locations, template manifests (e.g., `kubernetes-manifest-examples.mdx`).

## 4. File Naming Convention

File names must be highly descriptive to aid in search.
- For actions: Use `verb-noun-context` (e.g., `revoke-aws-keys.mdx`).
- For reference: Use `noun-context` (e.g., `nginx-config-locations.mdx`).

## 5. Discovery Strategy: Search & Tags

Because the directory structure is completely flat, discovery relies entirely on Docusaurus's search engine and Markdown Front Matter tags.

Every document MUST include robust front matter tags that define its context, tool, and content type.

**Example Front Matter:**
```yaml
---
title: 'Playbook: Revoke a Leaked AWS IAM Access Key'
tags: [aws, iam, security, incident-response, playbook]
---
```

```yaml
---
title: 'Kubernetes Deployment Manifest Examples'
tags: [kubernetes, k8s, reference, manifests, templates]
---
```