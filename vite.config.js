import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "/scheduling/find", // open this route
    proxy: {
      // Proxy /vnc requests to localhost:8080
      '/vnc': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vnc/, ''),
      },
    },
  },
  build: {
    outDir: "build" // change output folder to "build"
  }
})
