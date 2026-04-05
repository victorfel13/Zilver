import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Repo: victorfel13/Zilver → https://victorfel13.github.io/Zilver/ */
const pagesBase = '/Zilver/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? pagesBase : '/',
}))
