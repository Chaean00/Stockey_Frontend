import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

// 로컬 테스트용
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // 모든 네트워크 인터페이스에 바인딩
//     port: 3000, // 원하는 포트 (기본값: 5173)
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//       },
//     },
//   },
// });
