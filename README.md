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
| Photo galleries | `src/content/photography/*.md`; images in `public/assets/photography/<folder>/` |
| Studio, Booklists, Yoga | `src/pages/**/*.md` |
| Home, Photography and Writing indexes | `src/pages/**/*.astro` |
| Page shell (nav, footer, head) | `src/layouts/BaseLayout.astro` |
| Styles | `public/css/main.css` |
| Images and favicon | `public/assets/` |

In the booklists, books you haven't read yet have their title wrapped in `<span class="unread">…</span>`, which fades the row. When you finish one, remove the wrapper.

A new `.md` file in `src/content/writing/` becomes `/writing/<filename>`, and one in `src/content/photography/` becomes `/photography/<filename>`, with every image in its `gallery_folder` shown in filename order.

## Deploy

`npm run deploy` builds the site and uploads `dist/` to Cloudflare Workers (static assets only, configured in `wrangler.jsonc`). Or connect this repo in the Cloudflare dashboard (Workers & Pages → Create → Import a repository) with build command `npm run build` and deploy command `npx wrangler deploy`, so every push to `master` deploys.
