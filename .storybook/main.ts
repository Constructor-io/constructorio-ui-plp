import type { StorybookConfig } from "@storybook/react-vite";
let storiesRegexPaths = [
  "../src/stories/*.mdx", 
  "../src/stories/**/components/**/*.mdx",
  "../src/stories/**/components/**/*.stories.@(js|jsx|ts|tsx)",
  "../src/stories/**/components/**/*.stories.@(js|jsx|ts|tsx)",
  "../src/stories/**/hooks/UseCioPlp/*.mdx",
  "../src/stories/**/hooks/UseCioPlp/*.stories.@(js|jsx|ts|tsx)",
  "../src/stories/**/usage-examples/**/*.mdx",
]

if (process.env.NODE_ENV === 'dev') {
  storiesRegexPaths = ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"]
}

const config: StorybookConfig = {
  stories: storiesRegexPaths,

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm",
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {
    defaultName: 'Documentation'
  },

  staticDirs: ['./assets'],

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
