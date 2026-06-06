import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
 import path from 'path'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
    resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
})
