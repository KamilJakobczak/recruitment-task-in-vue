/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
	base: '/recruitment-task-in-vue/',
	plugins: [vue()],
	test: {
		environment: 'jsdom',
	},
	appType: 'mpa',
});
