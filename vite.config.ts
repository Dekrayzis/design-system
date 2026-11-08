import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFileSync, mkdirSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('.', import.meta.url));

/** Ship the raw token sheet so consumers can theme without pulling component CSS. */
function copyTokens(): Plugin {
  return {
    name: 'copy-tokens',
    closeBundle() {
      mkdirSync(resolve(root, 'dist'), { recursive: true });
      copyFileSync(resolve(root, 'src/styles/tokens.css'), resolve(root, 'dist/tokens.css'));
    },
  };
}

export default defineConfig({
  plugins: [react(), copyTokens()],
  css: {
    modules: {
      generateScopedName: 'ds-[name]__[local]--[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: resolve(root, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'styles',
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      // Runtime dependencies stay external, so apps share one copy and only load what they use.
      external: ['react', 'react-dom', 'react/jsx-runtime', /^libphonenumber-js(\/|$)/, /^country-flag-icons(\/|$)/],
    },
  },
});
