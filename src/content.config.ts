import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/writing' }),
	schema: z.object({
		title: z.string(),
		/** Shown verbatim under the signature, e.g. "May 21, 2020" or "February 14-15, 2025". */
		date: z.string(),
		/**
		 * Output the body as-is instead of rendering it as Markdown. Use this for HTML that
		 * must keep its blank lines and indentation, like a `<div class="poem-text">` poem.
		 */
		raw: z.boolean().default(false),
	}),
});

const photography = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/photography' }),
	schema: z.object({
		title: z.string(),
		shot_on: z.string().optional(),
		/** Folder under public/ holding the gallery's images. */
		gallery_folder: z.string(),
		/** Image under public/ shown on the Photography index card. */
		cover_image: z.string(),
	}),
});

export const collections = { writing, photography };
