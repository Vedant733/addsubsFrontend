import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://imaginative-salmiakki-3c4991.netlify.app/",
        secure: false,
      },
    },
  },
  plugins: [react()],
})
