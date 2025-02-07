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
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },

      // '/ws': {
      //   target: 'http://localhost:8080/ws',
      //   changeOrigin: true,
      //   ws: true,
      //   // rewrite: (path) => path.replace(/^\/sock/, ''),
      // },

      '/vidu': {
        target: 'wss://i12c206.p.ssafy.io:8443/',
        changeOrigin: true,
      },
    },
  },
  define: {
    global: 'window',
    'process.env': {},
  },
});
