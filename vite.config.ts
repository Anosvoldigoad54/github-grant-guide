import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['chart.js/auto'], 
    include: [
      'chart.js',
      'chartjs-adapter-dayjs-4',
      'react-chartjs-2',
      '@mui/material',
      '@mui/icons-material',
      'framer-motion'
    ]
  },
  server: {
    host: "::",
    port: 8080,
  },
}))
