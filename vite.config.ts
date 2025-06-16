import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/VigLabEquipmentSystem/',  // 👈 Your GitHub repo name here
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
