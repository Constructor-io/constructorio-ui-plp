import type { Preview } from "@storybook/react";
import './storybook-styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        ignoreSelector: '.docs-story h2, .docs-story h3'
      }
    },
  },
};

export default preview;
