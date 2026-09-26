// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from './integrations/sitemap.mjs';

export default defineConfig({
	site: 'https://thestudio.uno',
	integrations: [sitemap()],
	build: {
		// Emit writing/studio.html and studio/index.html, the same files Jekyll produced.
		format: 'preserve',
	},
	// Keep whitespace as authored: poems rely on it (e.g. `.poem-text` is `white-space: pre-wrap`).
	compressHTML: false,
});
