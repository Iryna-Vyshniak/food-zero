import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Коренева директорія для сервера розробки
  root: './', 
  
  build: {
    // Куди збирати готовий проєкт
    outDir: 'dist', 
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
  },
  
  server: {
    port: 3000,
    open: true, // Автоматично відкривати браузер при запуску npm run dev
  }
});