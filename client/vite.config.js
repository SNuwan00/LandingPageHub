import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Define configurations based on environment
  const isDevelopment = mode !== 'production';
  const apiBase = isDevelopment ? 'http://localhost:5001' : 'https://api.qrhub.csbodima.lk';
  
  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    server: {
      proxy: {
        '/api': apiBase,
      },
    },
    define: {
      '__API_BASE__': JSON.stringify(apiBase),
    }
  };
});
