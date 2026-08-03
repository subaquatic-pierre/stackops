import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const tailwindPlugin = (context: any, options: any) => {
  return {
    name: "docusaurus-tailwindcss",
    configurePostCss(postcssOptions: any) {
      postcssOptions.plugins.push(require("tailwindcss"));
      postcssOptions.plugins.push(require("autoprefixer"));
      return postcssOptions;
    },
  };
};

const config: Config = {
  title: "StackOps",
  tagline: "Software engineering through an operational lens",
  favicon: "img/icon.svg",

  url: "https://stackops.link",
  baseUrl: "/",

  organizationName: "stackops",
  projectName: "stackops",
  trailingSlash: false,

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    "docusaurus-plugin-sass",
    tailwindPlugin,
    [
      "@easyops-cn/docusaurus-search-local",
      {
        searchBarShortcut: false,
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          breadcrumbs: false,
        },
        blog: {
          path: "./journal",
          routeBasePath: "/engineering",
          blogTitle: "Journal",
          blogDescription:
            "A running log of engineering projects, labs, and journal entries.",
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: [
            "./src/css/custom.scss",
            "./src/css/brand.scss",
            "./src/css/markdown.scss",
            "./src/css/sidebar.scss",
            "./src/css/search.scss",
            "./src/css/layout.scss",
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/logo-dark-theme.svg",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "StackOps",
      logo: {
        alt: "StackOps Logo",
        src: "img/logo-light-theme.svg",
        srcDark: "img/logo-dark-theme.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Technical Reference",
        },
        {
          to: "/engineering",
          position: "left",
          label: "Journal",
        },
        {
          href: "https://github.com/subaquatic-pierre",
          position: "right",
          label: "GitHub",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Technical Reference",
              to: "/docs/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Journal",
              to: "/engineering",
            },
            {
              label: "GitHub",
              href: "https://github.com/subauqtic-pierre/stackops",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StackOps.`,
    },
    prism: {
      defaultLanguage: "bash",
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "shell-session",
        "docker",
        "yaml",
        "json",
        "hcl",
        "nginx",
        "rust",
        "toml",
        "sql",
        "go",
        "python",
        "typescript",
        "graphql",
        "makefile",
        "ini",
        "powershell",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
