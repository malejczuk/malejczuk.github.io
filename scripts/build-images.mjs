// Makes web versions of the photo originals in src/images/, which are never published.
//
// For each original it writes to public/img/ (mirroring the folder structure):
//   <name>.webp        at most 2000px on the long side, for pages and the lightbox
//   <name>-thumb.webp  800px wide, for gallery grids and cards
//   <name>-share.jpg   1200x630, the preview shown when a page is shared (JPEG, which every app accepts)
// Each file is rotated upright, converted to sRGB, stripped of all metadata (including GPS)
// and tagged with an Artist and Copyright notice.
//
// It also writes src/generated/images.json (sizes, used by the templates) and
// public/_redirects, so links to the old /assets/... image URLs still work.
// Unchanged originals are skipped, so re-running is quick.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { dirname, extname, join, relative, sep } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src/images');
const OUT = join(ROOT, 'public/img');
const MANIFEST = join(ROOT, 'src/generated/images.json');
const REDIRECTS = join(ROOT, 'public/_redirects');

const LARGE = 2000;
const THUMB = 800;
const SHARE = { width: 1200, height: 630 };
const QUALITY = { large: 82, thumb: 78, share: 80 };
const EXIF = {
	IFD0: {
		Artist: 'Kristoff Malejczuk',
		Copyright: 'Copyright Kristoff Malejczuk. All rights reserved. Prints and licensing: kristoff@thestudio.uno',
	},
};
// Bump when the settings above change, so every image is regenerated.
const VERSION = 2;

const IMAGE = /\.(jpe?g|png)$/i;

/** "photography/azores/azores - 1.jpeg" -> "photography/azores/azores-1" */
function slug(path) {
	const withoutExt = path.slice(0, -extname(path).length);
	return withoutExt
		.split(sep)
		.map((part) => part.toLowerCase().replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, ''))
		.join('/');
}

/** All files under `dir` whose name matches `pattern`. */
async function walk(dir, pattern = /./) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name), pattern) : pattern.test(e.name) ? [join(dir, e.name)] : [])),
	);
	return files.flat();
}

async function render(input, output, resize, format) {
	const image = sharp(input).rotate().resize(resize);
	const encoded = format === 'jpeg' ? image.jpeg({ quality: QUALITY.share, mozjpeg: true }) : image.webp(format);
	const info = await encoded.withExif(EXIF).toFile(output);
	return { width: info.width, height: info.height };
}

const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : { images: {} };
const reuse = previous.version === VERSION ? previous.images : {};

const originals = (await walk(SRC, IMAGE)).sort();
const images = {};
const seen = new Map();
let built = 0;

async function processImage(file) {
	const path = relative(SRC, file);
	const name = slug(path);
	if (seen.has(name)) throw new Error(`"${path}" and "${seen.get(name)}" would both become img/${name}.webp; rename one.`);
	seen.set(name, path);

	const large = join(OUT, `${name}.webp`);
	const thumb = join(OUT, `${name}-thumb.webp`);
	const share = join(OUT, `${name}-share.jpg`);
	const { mtimeMs } = await stat(file);
	const cached = reuse[path];
	if (cached && cached.mtimeMs === mtimeMs && [large, thumb, share].every((f) => existsSync(f))) {
		images[path] = cached;
		return;
	}

	await mkdir(dirname(large), { recursive: true });
	const big = await render(file, large, { width: LARGE, height: LARGE, fit: 'inside', withoutEnlargement: true }, { quality: QUALITY.large });
	const small = await render(file, thumb, { width: THUMB, withoutEnlargement: true }, { quality: QUALITY.thumb });
	// Crop to the most interesting region (faces, detail) rather than the centre.
	await render(file, share, { ...SHARE, fit: 'cover', position: sharp.strategy.attention }, 'jpeg');
	images[path] = {
		src: `/img/${name}.webp`,
		width: big.width,
		height: big.height,
		thumb: `/img/${name}-thumb.webp`,
		thumbWidth: small.width,
		thumbHeight: small.height,
		share: `/img/${name}-share.jpg`,
		mtimeMs,
	};
	built++;
}

// Process a few images at a time; each one holds a full-size decoded photo in memory.
const queue = [...originals];
await Promise.all(
	Array.from({ length: Math.min(4, availableParallelism()) }, async () => {
		while (queue.length) await processImage(queue.shift());
	}),
);

// Remove outputs whose original was deleted or renamed.
const expected = new Set(Object.values(images).flatMap((i) => [i.src, i.thumb, i.share].map((u) => join(ROOT, 'public', u))));
for (const file of existsSync(OUT) ? await walk(OUT) : []) {
	if (!expected.has(file)) await rm(file);
}

const sorted = Object.fromEntries(Object.keys(images).sort().map((k) => [k, images[k]]));
await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, `${JSON.stringify({ version: VERSION, images: sorted }, null, '\t')}\n`);

// Old URLs were /assets/<original path>, e.g. /assets/photography/azores/azores%20-%201.jpeg
const redirects = Object.entries(sorted).map(([path, { src }]) => `${encodeURI(`/assets/${path.split(sep).join('/')}`)} ${src} 301`);
await writeFile(REDIRECTS, `${redirects.join('\n')}\n`);

console.log(`images: ${originals.length} originals, ${built} rebuilt, ${originals.length - built} unchanged`);
