import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const URL_API = 'http://localhost:3000';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		proxy: {
			'/api': {
				target: URL_API,
				changeOrigin: false,
			},
		},
	},
});
