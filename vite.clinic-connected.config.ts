import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root,
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap:false, manifest:true, emptyOutDir:false,
    outDir:resolve(root, '../vip-clinic-connected-build'),
    rollupOptions:{ input:resolve(root, 'clinic-connected.html') }
  }
});
