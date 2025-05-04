// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Include JS files for JSX processing
      include: /\.(jsx?|tsx?)$/,
    })
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  // Add this to ensure JSX is properly handled in JS files
  esbuild: {
    jsx: 'automatic',
    jsxInject: `import React from 'react'`
  }
})
