import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root,
  esbuild: { jsx:'automatic' },
  build: { sourcemap:false, manifest:true, emptyOutDir:false,
    // Separate entry/output: never write ordinary dist or start the existing demo server.
    outDir:resolve(root,'../vip-stage6-build'),
    rollupOptions:{ input:resolve(root,'stage6-integration.html') } },
});
