import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Fix Big integer literals are not supported when targeting lower than ES2020
  build: {
    target: 'esnext',
  },

})
