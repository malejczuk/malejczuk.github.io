import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/writing' }),
	schema: z.object({
		title: z.string(),
		/** Shown verbatim under the signature, e.g. "May 21, 2020" or "February 14-15, 2025". */
		date: z.string(),
		/** Shown under the link in search results and link previews, e.g. the opening lines. */
		description: z.string().optional(),
		/** Language of the piece, if not English, e.g. "es". */
		lang: z.string().optional(),
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
		/** Shown in search results and link previews; defaults to the caption, if any. */
		description: z.string().optional(),
		shot_on: z.string().optional(),
		/** Folder under src/images/ holding the gallery's photos, e.g. "photography/azores". */
		gallery_folder: z.string(),
		/** Photo under src/images/ shown on the Photography index card. */
		cover_image: z.string(),
		/** Description of each photo for screen readers and image search, by file name. */
		alt: z.record(z.string(), z.string()).default({}),
	}),
});

export const collections = { writing, photography };
