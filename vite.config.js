import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// =============================================
// SEO DATA CONTEXT
// {{> head }}
// =============================================
const pageData = {
  '/index.html': {
    title: 'FoodZero | Home',
    description: 'Experience healthy, sustainable dining and organic recipes at FoodZero restaurant.',
  },
  '/menu.html': {
    title: 'FoodZero | Our Menu',
    description: 'Explore our seasonal menu featuring Starters, Mains, and Pastries & Drinks made with fresh ingredients.',
  },
  '/about.html': {
    title: 'FoodZero | Who We Are',
    description: 'Learn about our story, zero-waste philosophy, meet our restaurant manager and executive chef.',
  },
  '/contact.html': {
    title: 'FoodZero | Contact Us',
    description: 'Get in touch with FoodZero. Find our location, opening hours, and make a reservation.',
  },
  '/portfolio.html': {
    title: 'FoodZero | Portfolio',
    description: 'Explore our culinary portfolio featuring our best dishes and drinks showcased in a masonry grid.',
  },
  '/blog-list.html': {
    title: 'FoodZero | Blog',
    description: 'Read our latest articles on healthy eating, organic recipes, and sustainable lifestyle.',
  },
  '/single-dish.html': {
    title: 'FoodZero | Deep Sea Snow White Cod Fillet',
    description: 'Discover our signature Deep Sea Snow White Cod Fillet. Melt in your mouth experience with the best taste.',
  },
  '/single-post.html': {
    title: 'FoodZero | Blog Post',
    description: 'Read detailed insights and stories about sustainable food and cooking techniques.',
  },
  '/healthy-lifestyle.html': {
    title: 'FoodZero | Healthy Eating Lifestyle',
    description: 'Start planning your organic diet today. Discover how a well-balanced diet is the cornerstone of a vibrant life.',
  },
  '/coming-soon.html': {
    title: 'FoodZero | Coming Soon',
    description: 'Our new menu and features are launching soon. Stay tuned for updates.',
  }
};

export default defineConfig({
  // Коренева директорія проєкту
  root: './', 
  
  // Базовий шлях для деплою (якщо сайт не в корені домену)
  base: '/',

  /* =========================================
     PLUGINS CONFIGURATION
     ========================================= */
  plugins: [
    // Налаштування Handlebars для partials та змінних
    handlebars({
      // Шлях до папки з перевикористовуваними компонентами (header, footer, head тощо)
      partialDirectory: resolve(__dirname, 'src/html/partials'),
      
      // Функція для передачі контексту (змінних) у шаблони залежно від поточної сторінки
      context(pagePath) {
        return pageData[pagePath] || {};
      },
    }),

    // Конфігурація для генерації SVG спрайтів
    createSvgIconsPlugin({
      // Вкажіть директорію, де лежать окремі .svg файли іконок
      iconDirs: [resolve(process.cwd(), 'src/assets/images/icons')],
      // Формат ідентифікатора для тегу <use> (наприклад, #icon-facebook)
      symbolId: 'icon-[dir]-[name]',
      // Можна налаштувати інжекцію в body-first або body-last
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),

    // Налаштування оптимізатора зображень для продакшн-збірки
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      includePublic: true,
      logStats: true,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80, lossless: false },
      avif: { quality: 70, lossless: false },
      svg: {
        multipass: true,
        plugins: [
          { name: 'removeViewBox', active: false }, 
          { name: 'sortAttrs' },
          { name: 'removeDimensions', active: true },
        ]
      }
    })
  ],

  /* =========================================
     BUILD CONFIGURATION
     ========================================= */
  build: {
    // Директорія для готової збірки
    outDir: 'dist',
    // Очищати папку dist перед кожною збіркою
    emptyOutDir: true,
    // Генерація sourcemaps для дебагу продакшн коду (можна вимкнути: false)
    sourcemap: true,

    // Налаштування Rollup для багатосторінкової збірки
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Налаштування імен файлів у папці dist для кращого кешування
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff|woff2/.test(extType)) {
            extType = 'fonts';
          } else if (/css/.test(extType)) {
            extType = 'css';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      }
    },
  },
  
  /* =========================================
     DEV SERVER CONFIGURATION
     ========================================= */
  server: {
    port: 3000, // Порт локального сервера
    open: true, // Автоматично відкривати браузер
    cors: true, // Дозволити CORS
  },

  /* =========================================
     CSS CONFIGURATION
     ========================================= */
  css: {
    devSourcemap: true, // Sourcemaps для CSS під час розробки
  }
});