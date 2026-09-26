import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

/**
 * Writes /sitemap.xml listing every built page, the same file jekyll-sitemap produced.
 * (@astrojs/sitemap would move it to /sitemap-index.xml.)
 */
export default function sitemap() {
	let site;
	return {
		name: 'sitemap',
		hooks: {
			'astro:config:done': ({ config }) => {
				site = config.site;
			},
			'astro:build:done': async ({ dir, pages }) => {
				const urls = pages
					.map(({ pathname }) => {
						// studio/index.html is served at /studio/, writing/studio.html at /writing/studio.
						const path = pathname.replace(/\/$/, '');
						const isIndex = existsSync(new URL(`${path}/index.html`, dir));
						return new URL(isIndex && path ? `${path}/` : path, site).href;
					})
					.sort();
				const xml = [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
					...urls.map((url) => `<url>\n<loc>${url}</loc>\n</url>`),
					'</urlset>',
					'',
				].join('\n');
				await writeFile(new URL('sitemap.xml', dir), xml);
			},
		},
	};
}
