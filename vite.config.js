import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  root: '.',
  build: {
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ['highcharts', 'highcharts/highstock']
  }
})