import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vueSvg } from '../src/index';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueSvg(),vue()]
})
