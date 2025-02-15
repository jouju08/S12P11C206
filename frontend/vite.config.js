import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }], // '@'를 '/src' 폴더로 대체
  },
  server: {
    port: 3000,
    https: true,
    proxy: {
      '/api': {
        target: 'https://i12c206.p.ssafy.io:8080',
        changeOrigin: true,
        secure: false,
      },

      '/ws': {
        target: 'wss://i12c206.p.ssafy.io:8080/ws',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  define: {
    global: 'window',
    'process.env': {},
  },
});
