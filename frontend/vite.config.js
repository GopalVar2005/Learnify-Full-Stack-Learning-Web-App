import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/courses': 'http://localhost:8080',
      '/current_user': 'http://localhost:8080',
      '/register': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/student/dashboard': 'http://localhost:8080',
      '/instructor/dashboard': 'http://localhost:8080',
      '/enrollments': 'http://localhost:8080'
    }
  }
})
