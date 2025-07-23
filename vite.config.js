// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwind from "@tailwindcss/vite";


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     tailwind(),
//     react()],
//   server: {
//     host: '0.0.0.0', // Allow access from any device
//     port: 5173,      // Default Vite port
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwind(),
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // or wherever your Express server runs
        changeOrigin: true,
        secure: false,
      },
      '/uploads': 'http://localhost:5000'

    }
  }
})
