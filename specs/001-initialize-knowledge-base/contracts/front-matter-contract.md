# Contract: Knowledge-Base Document Front Matter

**Feature**: Initialize Knowledge Base Reference  
**Date**: 2026-07-31

## Purpose

This contract defines the front-matter schema for every document in the StackOps technical reference. All authors and tooling MUST conform to this schema when creating or validating knowledge-base content.

## Required Fields

| Field | Type | Constraints | Example |
|---|---|---|---|
| `title` | string | Non-empty; concise; describes the document's topic. | `"Playbook: Revoke a Leaked AWS IAM Access Key"` |
| `description` | string | Non-empty; 1-2 sentences summarizing the content. | `"Step-by-step commands to disable and delete a compromised IAM access key."` |
| `tags` | string[] | Non-empty; lowercase, hyphenated values; includes domain, tools, and content type. | `["aws", "iam", "security", "playbook"]` |

## Optional Fields

| Field | Type | Constraints | Example |
|---|---|---|---|
| `last_updated` | ISO 8601 date | Date the document was last reviewed for accuracy. | `"2026-07-31"` |
| `draft` | boolean | If `true`, Docusaurus excludes the document from production builds. | `false` |

## Examples

### Actionable document

```yaml
---
title: 'Playbook: Revoke a Leaked AWS IAM Access Key'
description: 'Disable and delete a compromised IAM access key using the AWS CLI.'
tags: [aws, iam, security, incident-response, playbook]
last_updated: '2026-07-31'
---
```

### Reference document

```yaml
---
title: 'AWS VPC Architecture Overview'
description: 'Common VPC patterns, subnet layouts, and routing decisions.'
tags: [aws, vpc, networking, reference, architecture]
last_updated: '2026-07-31'
---
```

## Tag Conventions

- Use lowercase, hyphenated words.
- Include the domain tag (`aws`, `kubernetes`, `linux`).
- Include the primary tool or service (`iam`, `pod`, `systemd`).
- Include the content type (`playbook`, `reference`, `manifest`).
- Include any cross-cutting concerns (`security`, `networking`, `troubleshooting`).

## Filename Conventions

| Content Type | Pattern | Example |
|---|---|---|
| Actionable | `verb-noun-context.mdx` | `revoke-leaked-iam-keys.mdx` |
| Reference | `noun-context.mdx` | `vpc-architecture-overview.mdx` |

## Validation

During the first phase, validation is manual and enforced through code review. Future phases may introduce build-time validation if the number of documents or authors grows.
