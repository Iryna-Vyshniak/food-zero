import { resolve } from 'path';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import pagesData from './src/data/pages.json';
import menuData from './src/data/menu.json';
import blogData from './src/data/blog-data.json';


// Dynamically generate context to eliminate DRY violations
const getPageContext = (pagePath) => {
  // 1. Get base SEO data (Title, Description) from pages.json
  const baseData = pagesData[pagePath] || {};

  // 2. Map page-specific dynamic data natively
  const dynamicData = {
    '/index.html': { homeMenu: menuData.homeMenu, homeArticles: blogData.articles.slice(0, 2) },
    '/menu.html': { menuData: menuData },
    '/bloglist.html': {blogData: blogData.articles}, 
    '/article-meat.html': { widgetBlog: blogData.articles.slice(0, 4) },
    // Add other page-specific data imports here as the project grows
  };

  return {
    ...baseData,
    ...(dynamicData[pagePath] || {})
  };
};

export default defineConfig({
  root: './', 
  base: '/',
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/html/partials'),
      context: getPageContext, // Use the dynamic function
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
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        about: resolve(__dirname, 'about.html'),
        bloglist: resolve(__dirname, 'bloglist.html'), 
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
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
    devSourcemap: true,
  }
});