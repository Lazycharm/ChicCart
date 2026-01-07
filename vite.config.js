import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // More specific aliases must come first
      { find: /^@\/components\/(.*)$/, replacement: path.resolve(__dirname, './Components/$1') },
      { find: '@/components', replacement: path.resolve(__dirname, './Components') },
      { find: '@/utils', replacement: path.resolve(__dirname, './utils.js') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
});
