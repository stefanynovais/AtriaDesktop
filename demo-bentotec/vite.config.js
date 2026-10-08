import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Porta 5174 (e não a 5173 do site) pra dar pra deixar os dois abertos ao mesmo tempo.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, strictPort: true },
  preview: { port: 5174, strictPort: true },
});
