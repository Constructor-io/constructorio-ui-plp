import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [cssInjectedByJsPlugin({
    styleId: 'cio-plp-styles'
  })],
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input: {
        app: "./src/bundled.jsx",
      },
      output: {
        entryFileNames: `constructorio-ui-plp-bundled.js`,
      },
    },
  },
});
