# origindb.org

Marketing site for **[OriginDB](https://github.com/origindb/origindb)** — an
open-source realtime WebSocket database where your application logic runs
*inside* the engine as sandboxed WebAssembly reducers, streamed to clients over
a SQL-filtered changefeed and made durable by a group-commit WAL.

Static, dependency-free, and self-contained — three files and some fonts.

```
index.html          markup + copy
assets/styles.css    design system (engineered terminal-brutalism)
assets/main.js       reveal-on-scroll, nav state, changefeed-stream canvas
CNAME                origindb.org (GitHub Pages custom domain)
```

## Develop

No build step. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 4321
# → http://localhost:4321
```

## Deploy

Any static host works. It's wired for **GitHub Pages** out of the box:

1. Push to a repo, enable Pages (branch `main`, root `/`).
2. `CNAME` already points the site at `origindb.org` — add the matching DNS
   records (an `A`/`ALIAS` to GitHub Pages, or a `CNAME` for `www`).
3. Netlify / Vercel / Cloudflare Pages: point them at the repo root, no build
   command, publish directory `.`.

## Design notes

- **Type:** Clash Display (Fontshare) for display, JetBrains Mono for technical
  labels/code, General Sans for body. Graceful system fallbacks if the font
  CDNs are unreachable.
- **Palette:** near-black canvas, signature cyan `#41d6ff` (the through-line
  accent from the OriginDB demos) with amber and magenta signal accents.
- **Motion:** a light canvas "changefeed stream", staggered reveal-on-scroll,
  animated pipeline packets. All disabled under `prefers-reduced-motion`.

## Content

Every claim traces to the OriginDB repo: the WASM ABI, the durability design
doc, and the benchmark suite. Performance figures are the repo's measured
worst-case (dev Mac, `F_FULLFSYNC`); keep them in sync if the numbers move.

MIT © 2026 OriginDB Project.
