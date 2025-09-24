// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     open: "/scheduling/find", // 👈 dev server will open this route
//   },
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "/scheduling/find", // 👈 dev server will open this route
  },
  build: {
    outDir: "build" // 👈 change output folder to "build"
  }
})
