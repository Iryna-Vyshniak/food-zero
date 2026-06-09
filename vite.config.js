import { resolve } from 'path';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import homeData from './src/data/home.json';
import menuData from './src/data/menu.json';


const pageData = {
  '/index.html': {
    title: 'FoodZero | Home',
    description: 'Experience healthy, sustainable dining and organic recipes at FoodZero restaurant.',
    homeMenu:  menuData.homeMenu
  },
  '/menu.html': {
    title: 'FoodZero | Our Menu',
    description: 'Explore our seasonal menu featuring Starters, Mains, and Pastries & Drinks made with fresh ingredients.',
    menuData: menuData 
  },
  '/about.html': {
    "title": "FoodZero | Who We Are",
    "description": "Learn about our story, zero-waste philosophy, meet our restaurant manager and executive chef.",
  },
};

export default defineConfig({
  root: './', 
  base: '/',
  plugins: [
   handlebars({
      partialDirectory: resolve(__dirname, 'src/html/partials'),
      context(pagePath) {
        return pageData[pagePath] || {};
      },
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/images/icons')],
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
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
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,

    // Налаштування Rollup для багатосторінкової збірки
 rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        about: resolve(__dirname, 'about.html'),
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Запобіжник на випадок відсутності імені файлу
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';

          let extType = assetInfo.name.split('.').at(-1).toLowerCase();
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
            extType = 'images';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          } else if (/css/i.test(extType)) {
            extType = 'css';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      }
    },
  },
  server: {
    port: 3000,
    open: true, 
    cors: true,
  },
  css: {
    devSourcemap: true, // Sourcemaps для CSS під час розробки
  }
});