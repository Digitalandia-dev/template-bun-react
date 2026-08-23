import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function inlineCssPlugin(): Plugin {
  return {
    name: 'vite-plugin-inline-critical-css',
    apply: 'build',
    closeBundle() {
      const distPath = path.resolve('dist');
      const indexPath = path.join(distPath, 'index.html');

      if (!fs.existsSync(indexPath)) return;

      let html = fs.readFileSync(indexPath, 'utf8');
      const assetsDir = path.join(distPath, 'assets');

      // 1. Inyectar CSS inlined en el <head>
      if (fs.existsSync(assetsDir)) {
        const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
        for (const cssFile of cssFiles) {
          const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
          html = html.replace(
            '</head>',
            `<style id="inlined-app-css">${cssContent}</style></head>`
          );
        }
      }

      // 2. Eliminar link stylesheet externo para evitar bloqueo de renderizado
      html = html.replace(
        /<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*assets\/[^"']*\.css["'][^>]*>/gi,
        ''
      );

      fs.writeFileSync(indexPath, html, 'utf8');
      console.log('[vite-plugin-inline-critical-css] Inlined CSS into dist/index.html');
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCssPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
});

