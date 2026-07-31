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
  tagline: "Software engineering through an operational lense",
  favicon: "img/icon.svg",

  url: "https://stackops.link",
  baseUrl: "/",

  organizationName: "stackopshq",
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

  plugins: [tailwindPlugin],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/stackopshq/stackops/tree/main/",
        },
        blog: {
          path: './projects',
          routeBasePath: '/projects',
          blogTitle: 'Projects',
          blogDescription: 'A showcase of my projects',
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
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
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
          to: "/projects", 
          position: "left",
          label: "Projects",
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
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Projects",
              to: "/projects",
            },
            {
              label: "GitHub",
              href: "https://github.com/stackopshq",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} StackOps.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;