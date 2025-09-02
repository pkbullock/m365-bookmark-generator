import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

//import sparkPlugin from "@github/spark/spark-vite-plugin";
//import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    //createIconImportProxy() as PluginOption,
    //sparkPlugin() as PluginOption,
  ],
  publicDir: 'public',
  server: {
    port: 5000
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
