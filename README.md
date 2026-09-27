# My Website

Built with [Astro](https://astro.build) and hosted on Cloudflare at [thestudio.uno](https://thestudio.uno).

## Develop

```sh
npm install
npm run dev       # http://localhost:4321
npm run preview   # build, then serve dist/ the way Cloudflare will
```

## Where things live

| What | Where |
|---|---|
| Writing pieces | `src/content/writing/*.md` (add new ones to `src/components/WritingMenu.md` too, or `WritingMenuSpanish.md` for pieces in Spanish) |
| Photo galleries | `src/content/photography/*.md` (title, cover, and `alt:` descriptions of each photo); photos in `src/images/photography/<folder>/` |
| Photos (originals) | `src/images/`; never published, see below |
| Studio, Booklists, Yoga | `src/pages/**/*.md` |
| Home, Photography and Writing indexes | `src/pages/**/*.astro` |
| Page shell (nav, footer, head) | `src/layouts/BaseLayout.astro` |
| Styles | `public/css/main.css` |
| Favicon | `src/favicon.jpg` (a square photo); run `npm run favicon` after changing it |

In the booklists, books you haven't read yet have their title wrapped in `<span class="unread">…</span>`, which fades the row. When you finish one, remove the wrapper.

## Photos

Put full-size originals in `src/images/`. `npm run dev` and `npm run build` first run `npm run images`, which writes web versions to `public/img/` (with GPS and other metadata removed, and a copyright notice added):

- `<name>.webp`: at most 2000px, used on pages and in the gallery lightbox
- `<name>-thumb.webp`: 800px wide, used in gallery grids and cards
- `<name>-share.jpg`: 1200x630, the preview shown when a link is shared

`<name>` is the original's path, lowercased with spaces and symbols turned into dashes: `src/images/yoga/IMG_4261.JPG` becomes `/img/yoga/img_4261.webp`. Use that path to show a photo in a Markdown page, e.g. `![Kristoff practicing yoga](/img/yoga/img_4261.webp)`.

## Pages

A new `.md` file in `src/content/writing/` becomes `/writing/<filename>`, and one in `src/content/photography/` becomes `/photography/<filename>`, with every image in its `gallery_folder` shown in filename order.

## Deploy

`npm run deploy` builds the site and uploads `dist/` to Cloudflare Workers (static assets only, configured in `wrangler.jsonc`). Or connect this repo in the Cloudflare dashboard (Workers & Pages → Create → Import a repository) with build command `npm run build` and deploy command `npx wrangler deploy`, so every push to `master` deploys.
