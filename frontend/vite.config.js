import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: [{ find: '@', replacement: '/src' }], // '@'를 '/src' 폴더로 대체
  },
  server: {
    port: 3000,
    https: true,
    proxy: {
      '/api': {
        target: 'http://i12c206.p.ssafy.io:8080',
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
  build: {
    rollupOptions: {
      output: {
        // 빌드 산출물의 파일명에 해시를 포함시켜 캐시 무효화가 자동으로 이루어지도록 함
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]'
      }
    }
  },
  define: {
    global: 'window',
    'process.env': {},
  },
});
