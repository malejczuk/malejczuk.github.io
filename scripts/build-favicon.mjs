// Makes the site icons from src/favicon.jpg (a square photo). Run `npm run favicon` after
// changing it, and commit the results:
//   public/assets/favicon.ico    16, 32 and 48px, for browser tabs and bookmarks
//   public/apple-touch-icon.png  180px, for iPhone and iPad home screens

import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const SOURCE = `${ROOT}src/favicon.jpg`;

const png = (size) => sharp(SOURCE).resize(size, size).png().toBuffer();

/** An .ico file holding PNG images (supported by every current browser). */
function ico(images) {
	const header = Buffer.alloc(6 + 16 * images.length);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(images.length, 4);
	let offset = header.length;
	images.forEach(({ size, data }, i) => {
		const entry = 6 + 16 * i;
		header.writeUInt8(size >= 256 ? 0 : size, entry); // width
		header.writeUInt8(size >= 256 ? 0 : size, entry + 1); // height
		header.writeUInt16LE(1, entry + 4); // colour planes
		header.writeUInt16LE(32, entry + 6); // bits per pixel
		header.writeUInt32LE(data.length, entry + 8);
		header.writeUInt32LE(offset, entry + 12);
		offset += data.length;
	});
	return Buffer.concat([header, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })));
await writeFile(`${ROOT}public/assets/favicon.ico`, ico(images));
await writeFile(`${ROOT}public/apple-touch-icon.png`, await png(180));
console.log(`favicon: favicon.ico (${sizes.join(', ')}px) and apple-touch-icon.png (180px)`);
