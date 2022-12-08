import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { urbitPlugin } from "@urbit/vite-plugin-urbit";

import * as dotenv from 'dotenv';
dotenv.config()

const target = process.env.VITE_URBIT_TARGET;
const base = process.env.VITE_URBIT_DESK;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    urbitPlugin({ base, target }),
  ],
  // Fix Big integer literals are not supported when targeting lower than ES2020
  build: {
    target: 'esnext',
  },

})
