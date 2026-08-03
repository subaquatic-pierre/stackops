- /docs/runtimes/python.mdx
  - include pastAPI examples
  - bare bones scripts
  - package managers including uv and any other main including virtual envs and pip3
- /docs/runtimes/rust.mdx
  - include examples how to use axum
  - wasm with react frontend
  - no-std environment for kernel OS projects
- /docs/runtimes/nodejs.mdx
  - use with typescipt
  - eslint comon exaplmes
  - prettier

- /docs/editors/vim.mdx
  - include common settings, and shortcuts , configs etc.
- /docs/editors/vscode.mdx
  - include my settings for vscode
  - extensions

  ```
  {
  // EDITOR
  "editor.inlayHints.fontFamily": "Courier New",
  "editor.inlayHints.fontSize": 11,
  "editor.inlayHints.enabled": "on",
  "editor.glyphMargin": false, // show debug lines
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.renderControlCharacters": false,
  "editor.unicodeHighlight.ambiguousCharacters": false,
  "window.menuBarVisibility": "toggle",
  "window.confirmSaveUntitledWorkspace": false,
  "window.customTitleBarVisibility": "windowed",
  "editor.guides.bracketPairs": true,
  "editor.lineNumbers": "on",
  "editor.wrappingIndent": "same",
  "editor.fontSize": 14,
  "window.zoomLevel": 1.3,
  "editor.fontWeight": "600",
  "editor.fontFamily": "'Fira Code', 'monospace', 'Droid Sans Fallback'",
  "editor.fontLigatures": true,
  "zenMode.centerLayout": false,
  "zenMode.hideLineNumbers": false,
  "editor.suggestSelection": "first",
  "editor.matchBrackets": "always",
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.tabSize": 2,
  "editor.cursorStyle": "block",
  "editor.wordWrap": "wordWrapColumn",
  "editor.wordWrapColumn": 100,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit",
    // "source.organizeImports": "explicit"
  },
  "jsonColorToken.languages": [
    "typescript",
    "typescriptreact",
    "json",
    "jsonc",
  ],

  // THEME
  "workbench.colorTheme": "Monokai",
  "workbench.iconTheme": "material-icon-theme",
  "material-icon-theme.files.associations": {
    "**.html": "html",
  },
  "workbench.colorCustomizations": {
    "[Monokai]": {
      "editorLineNumber.foreground": "#434343",
      // "editorLineNumber.foreground": "#0e0d0d",
      "editor.lineHighlightBackground": "#23292f",
      "editor.selectionBackground": "#3b3b3b",
      "tab.inactiveModifiedBorder": "#202020",
      "tab.inactiveBackground": "#202020",
      "tab.border": "#0e0d0d",
      "tab.activeBorder": "#0e0d0d",
      "titleBar.border": "#0e0d0d",
      "editorInfo.background": "#0e0d0d4d",
      "editorGroupHeader.tabsBackground": "#0e0d0d",
      "terminal.background": "#0e0d0d",
      "editor.background": "#0e0d0d",
      "sideBar.background": "#0e0d0d",
      "activityBar.background": "#0e0d0d",
      "list.focusBackground": "#0e0d0d",
      "terminal.ansiBlack": "#0e0d0d",
      "terminal.dropBackground": "#0e0d0d62",
      "statusBar.background": "#0e0d0d",
      "sideBarSectionHeader.background": "#0e0d0d",
    },
  },

  // TERRAFORM
  "terraform.experimentalFeatures.validateOnSave": true,
  "terraform.experimentalFeatures.prefillRequiredFields": true,
  "[terraform]": {
    "editor.suggest.preview": true,
    "editor.defaultFormatter": "hashicorp.terraform",
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.formatAll.terraform": "always",
    },
  },

  // WORKBENCH
  // "workbench.editor.enablePreview": false,
  // "workbench.editor.enablePreviewFromQuickOpen": false,
  // "workbench.editor.enablePreviewFromCodeNavigation": false,
  "workbench.list.horizontalScrolling": true,
  "workbench.settings.editor": "json",
  "workbench.tips.enabled": false,
  "workbench.startupEditor": "newUntitledFile",
  "workbench.settings.useSplitJSON": true,
  "workbench.secondarySideBar.defaultVisibility": "hidden",

  "diffEditor.ignoreTrimWhitespace": false,
  "files.exclude": {
    "**/.classpath": true,
    "**/.project": true,
    "**/.settings": true,
    "**/.factorypath": true,
  },

  // EXPLORER
  "emmet.triggerExpansionOnTab": true,
  "explorer.confirmDragAndDrop": false,
  "explorer.confirmDelete": false,
  // "files.watcherExclude": {
  //   "**/.git/objects/**": true,
  //   "**/.git/subtree-cache/**": true,
  //   "**/node_modules/*/**": true,
  //   "**/venv/**": true,
  // },

  // TERMINAL
  "terminal.integrated.fontFamily": "'Fira Code', 'monospace', 'Droid Sans Fallback'",
  "terminal.integrated.gpuAcceleration": "on",
  "terminal.integrated.lineHeight": 1.3,
  "terminal.external.linuxExec": "terminator",
  "terminal.integrated.fontSize": 15,
  "debug.console.fontSize": 14.5,
  "debug.console.fontFamily": "'Fira Code', 'monospace', 'Droid Sans Fallback'",
  "[dockercompose]": {
    "editor.insertSpaces": true,
    "editor.tabSize": 2,
    "editor.autoIndent": "advanced",
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": true,
    },
    "editor.defaultFormatter": "redhat.vscode-yaml",
  },

  // FILE ASSOCIATIONS
  "files.associations": {
    "*.sh": "shellscript",
    ".env": "dotenv",
    ".env.*": "dotenv",
    "*.env": "dotenv",
    ".envrc": "dotenv",
    "**/nginx/sites-available/*": "nginx",
    "**/nginx/sites-enabled/*": "nginx",
    "**/nginx/snippets/*": "nginx",
    "**/nginx/*conf*": "nginx",
    "**/nginx/*params": "nginx",
  },

  // VIM
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"],
    },
  ],
  "vim.cursorStylePerMode.insert": "line-thin",
  "vim.cursorStylePerMode.normal": "block",
  "vim.handleKeys": {
    "<C-c>": false,
    "<C-x>": false,
    "<C-v>": false,
    "<C-w>": false,
    "<C-d>": false,
    "<C-s>": false,
    "<C-z>": false,
    "<C-a>": false,
  },

  // GIT
  "git.confirmSync": false,
  "git.enableSmartCommit": true,

  // SQL
  "Prettier-SQL.SQLFlavourOverride": "postgresql",
  "[sql]": {
    "editor.defaultFormatter": "inferrinizzard.prettier-sql-vscode",
  },

  // RUST
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer", // Makes the magic,
  },
  "rust-analyzer.completion.callable.snippets": "fill_arguments",
  "rust-analyzer.diagnostics.disabled": ["inactive-code"],
  "debug.allowBreakpointsEverywhere": false,

  // C
  "[c]": {
    "editor.defaultFormatter": "ms-vscode.cpptools",
  },

  // HTML
  "[html]": {
    "editor.suggest.insertMode": "replace",
    // "editor.formatOnType": true
    // "editor.formatOnSave": false
  },

  // GO
  "[go]": {
    "editor.defaultFormatter": "golang.go",
    "editor.insertSpaces": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit",
    },
  },
  "go.toolsManagement.autoUpdate": true,
  "go.alternateTools": {
    "go": "/snap/go/current/bin/go",
  },

  // JAVA
  // "java.home": "/usr/lib/jvm/jdk-11.0.11+9",
  // "java.configuration.runtimes": [
  //   {
  //     "name": "JavaSE-11",
  //     "path": "/usr/lib/jvm/java-11-openjdk-amd64",
  //   },
  // ],

  // PYTHON
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.wordWrap": "wordWrapColumn",
    "editor.wordWrapColumn": 100,
  },
  "python.languageServer": "Pylance",
  "emmet.includeLanguages": {
    "jinja-html": "html",
  },
  "python.analysis.typeCheckingMode": "basic",

  // JAVASCRIPT / TYPESCRIPT
  "js/ts.updateImportsOnFileMove.enabled": "always",
  "js/ts.inlayHints.parameterNames.enabled": "all",
  "js/ts.tsserver.experimental.enableProjectDiagnostics": true,

  // MARKDOWN
  "[markdown]": {
    "editor.wordWrap": "wordWrapColumn",
    "editor.wordWrapColumn": 120,
    "editor.renderWhitespace": "all",
    "editor.quickSuggestions": {
      "comments": "off",
      "strings": "off",
      "other": "off",
    },
    "editor.suggestOnTriggerCharacters": false,
    "editor.wordBasedSuggestions": "off",
    "editor.formatOnPaste": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    //
    "editor.snippetSuggestions": "top",
    "editor.tabCompletion": "on",
    //
    "editor.acceptSuggestionOnEnter": "on",
    //
  },

  // NGINX
  "[nginx]": {
    "editor.defaultFormatter": "ahmadalli.vscode-nginx-conf",
    "editor.insertSpaces": true,
    "editor.tabSize": 4,
    "editor.detectIndentation": false,
  },

  // DOT ENV
  "[dotenv]": {},

  "[s]": {
    "editor.wordWrap": "wordWrapColumn",
    "editor.wordWrapColumn": 120,
  },

  // .NET

  // CSS
  "css.lint.unknownAtRules": "ignore",

  // SHELL
  "shellcheck.enable": false, // disable globally
  "[shellscript]": {
    "editor.defaultFormatter": "mkhl.shfmt",
    "editor.formatOnSave": true,
    "shellcheck.enable": true,
  },
  "shfmt.executablePath": "/usr/bin/shfmt",

  // SOLIDITY
  "security.workspace.trust.untrustedFiles": "open",

  // SPELL CHECK
  "cSpell.useCustomDecorations": true,
  "cSpell.textDecoration": "underline dashed #FFFFFF2F",
  "cSpell.enabledFileTypes": {
    "json": false,
    "python": true,
  },
  "cSpell.customDictionaries": {
    "custom-dictionary-user": {
      "name": "custom-dictionary-user",
      "path": "~/.cspell/custom-dictionary-user.txt",
      "addWords": true,
      "scope": "user",
    },
  },

  // JUPYTER NOTEBOOK
  "workbench.editorAssociations": {
    "*.ipynb": "jupyter-notebook",
  },
  "notebook.cellToolbarLocation": {
    "default": "right",
    "jupyter-notebook": "left",
  },

  // DOCKER
  "docker.extension.enableComposeLanguageServer": false,

  // MAKEFILE
  "makefile.buildBeforeLaunch": false,
  "makefile.configureOnEdit": false,
  "makefile.configureOnOpen": false,

  // ERROR LENSE
  // "errorLens.enabledDiagnosticLevels": ["error"],
  // "errorLens.excludePatterns": ["*/**/*.tsx", "*/**/*.jsx"],

  // YAML
  "[yml]": {
    "editor.wordWrapColumn": 200,
  },
  "yaml.validate": false,
  "yaml.schemas": {
    "https://squidfunk.github.io/mkdocs-material/schema.json": "mkdocs.yml",
  },
  "yaml.customTags": [
    "!And",
    "!And sequence",
    "!If",
    "!If sequence",
    "!Not",
    "!Not sequence",
    "!Equals",
    "!Equals sequence",
    "!Or",
    "!Or sequence",
    "!FindInMap",
    "!FindInMap sequence",
    "!Base64",
    "!Join",
    "!Join sequence",
    "!Cidr",
    "!Ref",
    "!Sub",
    "!Sub sequence",
    "!GetAtt",
    "!GetAZs",
    "!ImportValue",
    "!ImportValue sequence",
    "!Select",
    "!Select sequence",
    "!Split",
    "!Split sequence",
  ],
  "debug.breakpointsView.presentation": "tree",
  "chat.disableAIFeatures": true,
  "breadcrumbs.enabled": false,
  "json.schemaDownload.trustedDomains": {
    "https://developer.microsoft.com/json-schemas/": true,
    "https://json-schema.org/": true,
    "https://json.schemastore.org/": true,
    "https://models.dev/model-schema.json": true,
    "https://opencode.ai/config.json": true,
    "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json": true,
    "https://raw.githubusercontent.com/devcontainers/spec/": true,
    "https://raw.githubusercontent.com/microsoft/vscode/": true,
    "https://schemastore.azurewebsites.net/": true,
    "https://www.schemastore.org/": true,
  },
  }
  ```

```

```

- /docs/databases/postgres.mdx
  - user management commands
  - database management commands
  - configs and locations
  - basic crud examples

- /docs/databases/mongodb.mdx
  - user management commands
  - database management commands
  - configs and locations
  - basic crud examples

- /docs/kubernetes/user-management.mdx
- /docs/kubernetes/common-design-patterns.mdx
- /docs/kubernetes/config.mdx
  - user config
  - kubectl
  - kubelet
  - static pods
  - logging
- /docs/kubernetes/node-setup.mdx
  - kernel params
  - all configs needed to set a worker node
  - all config needed to set control node
  - how to update
  - networking and storage
- /docs/kubernetes/eks.mdx
  - CSI drivers
  - AWS VPC CNI
  - load balancer ingress
- /docs/kubernetes/helm.mdx
  - with examples
- ArgoCD and GitOps section
- SRE with Grafana, Loki, Prometheus, Mimir
  - different architectual tradeoffs the deployment considerations of micro service and monolithic and anything else
- /docs/aws/\*.mdx
  - common aws architectures, create manyu docs references with CLI and console workflows
  - user management, IAM policies etc.
