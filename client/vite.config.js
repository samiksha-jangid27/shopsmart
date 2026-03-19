import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            }
        }
    },

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },

    // ✅ FIX HERE
    css: {
        postcss: mode === 'test' ? {} : undefined,
    },
}))