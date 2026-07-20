# OriginDB site — supporting-graphics production plan

Plan for producing every visual asset in the redesign mockup. Goal: a crafted,
cohesive look (Linear / Framer / cal.com tier), **not** AI slop. The mockup is a
**light** redesign (today's site is dark) — this plan lists the light-theme
tokens and the assets to build.

> Naming: the mockup shows "InstantDB" — all assets ship as **OriginDB** (logo,
> wordmark, meta). The hexagon mark carries over.

---

## 0. Guiding principle — vector first, raster never (except maybe the hero)

| Type | Method | Why |
|------|--------|-----|
| Logo, all icons, decor (orbs, orbital rings, mesh) | **SVG / CSS in code** | Crisp at any DPI, ~1–3 KB each, theme-aware (light+dark), animatable, zero slop, self-contained (Artifact/CSP-safe) |
| Company "trusted by" logos | **Official brand assets** or drop | Never fabricate endorsements or redraw a company's mark from memory |
| Hero centerpiece (glass DB stack) | **1 of 3 routes** (see §4) | The one asset where raster/3D is defensible |

Everything below is theme-aware: assets use `currentColor` or CSS vars, so one
file serves light and dark.

---

## 1. Design tokens (lock these first — feed both code and AI prompts)

Light theme, derived from the mockup + the existing `--primary #3B82F6`:

```css
/* surfaces */
--bg-1:#ffffff;  --bg-2:#f7f8fe;  --bg-wash:#eef0ff;   /* page: white → lavender */
--card:#ffffff;  --card-glass:rgba(255,255,255,.72);
--line:#e6e8f2;  --line-2:#eceef7;
/* ink */
--tx-1:#0f172a;  --tx-2:#334155;  --tx-3:#64748b;
/* brand ramp — blue → violet (the hero + headline gradient) */
--blue:#3b82f6;  --blue-lo:#60a5fa;  --blue-hi:#2563eb;
--violet:#8b5cf6; --violet-lo:#a78bfa; --violet-hi:#6d5ae6;
--grad-brand: linear-gradient(120deg,#3b82f6,#8b5cf6);
/* pastel icon wells (feature row) */
--well-blue:#e8f1fe; --well-teal:#e0f7f1; --well-violet:#f0ebfe;
--well-pink:#fce9f1; --well-sky:#e9f5fe;
```

Hex list for AI prompts: primary blue `#3B82F6`, violet `#8B5CF6`, deep indigo
`#6D5AE6`, page wash `#EEF0FF`, glass white. Keep every asset inside this ramp —
**no rainbow, no orange/green** — that alone kills 80% of the "slop" feel.

---

## 2. Asset inventory (what's in the mockup → how to make it)

| # | Asset | Where | Method | Status |
|---|-------|-------|--------|--------|
| 1 | Hexagon logo mark + "OriginDB" wordmark | nav, footer | SVG | build |
| 2 | Feature-row icons ×5 (bolt, database, `</>`, lock, cloud) in pastel wells | features | SVG sprite | 3 exist, +2 |
| 3 | Floating-card icons ×3 (bolt, shield, bar-chart) | hero | SVG sprite | +2 |
| 4 | Stat icons ×4 (star, git-branch, users, license) | under hero | SVG sprite | +3 |
| 5 | Social icons ×4 (github, discord, X, globe) | footer | SVG sprite | +3 |
| 6 | UI glyphs (arrow, copy, paper-plane) | buttons, code, newsletter | SVG sprite | +2 |
| 7 | **Hero centerpiece — glass DB stack + bolt** | hero | §4 (pick a route) | build |
| 8 | Floating glass feature cards (frame) | hero | CSS (`backdrop-filter`) | style, not art |
| 9 | Orbital dashed rings | hero | SVG `<ellipse>` + dasharray | build |
| 10 | Floating orbs / bokeh particles | hero + CTA | CSS radial-gradient + blur | build |
| 11 | Page background wash + optional grain | global | CSS gradient (+ SVG noise) | build |
| 12 | CTA panel gradient blob + dotted texture | CTA | CSS radial + dot mask | build |
| 13 | Code editor | Live Queries | HTML/CSS (existing `CodePanel`) | reuse |
| 14 | "Trusted by" company logos | trust strip | official assets / drop | acquire |

Net new to draw: **~12 icons + logo + hero + decor**. No icon needs AI.

---

## 3. Vector assets — how to build (the bulk of the work)

### 3.1 Logo mark
Hexagon "cube" prism with a blue→violet face gradient and an inner notch (the
current mark works). One SVG, 24×24 viewBox, `<linearGradient>` `--grad-brand`.
Wordmark = the site display font, weight 800, `-0.02em` tracking. Ship a
`components/Logo.tsx` (mark + wordmark, `size` prop).

### 3.2 Icon sprite (extend the existing `components/IconSprite.tsx`)
Already present: `arrow, back, box, check, code, cpu, database, drive, filter,
github, mouse, refresh, rewind, terminal, users, zap`.

**Add these** (24×24, 1.75px stroke, round caps/joins, single path where
possible, `stroke="currentColor"` so wells/tint come from CSS):
`lock, cloud, shield, bar-chart, star, git-branch, license (file-text),
discord, x-twitter, globe, copy, send`.

- Keep ONE stroke width and corner radius across all icons — inconsistency here
  is the #1 tell of a cobbled-together set. Base them on one library (Lucide or
  Phosphor) and hand-tune, or draw fresh on a shared 24px grid.
- Brand glyphs (github/discord/x) are the official marks — take from
  Simple Icons (CC0) rather than redrawing.
- Feature-row wells: 56px circle, `background:var(--well-*)`, icon in
  `--blue`/`--violet`; one well tint per card, cycled from the token list.

### 3.3 Decorative (pure CSS/SVG, animatable, theme-aware)
- **Orbs:** `<span>`s, `border-radius:50%`, `background:radial-gradient(circle at 30% 30%, #fff, var(--blue-lo))`, `filter:blur(.5px)`, low opacity, absolutely positioned; 2–3 float via `@keyframes` (translateY + opacity). Bokeh = larger, more blur, lower opacity.
- **Orbital rings:** inline SVG `<ellipse>` (skewed for iso feel), `fill:none; stroke:var(--line-2); stroke-dasharray:2 8; stroke-linecap:round`; slow `rotate` keyframe. 1–2 rings behind the hero object.
- **Page wash:** `body` → `radial-gradient(1200px 700px at 70% -5%, var(--bg-wash), var(--bg-1) 55%)`. Optional grain: a tiled `feTurbulence` SVG data-URI at `opacity:.03`, `mix-blend-mode:overlay`.
- **CTA blob:** big soft `radial-gradient` in brand ramp + a `radial-gradient` dot pattern masked to the corner.

---

## 4. Hero centerpiece — the glass database stack (pick ONE route)

The signature asset: stacked translucent glass slabs, a glowing lightning bolt
on top, blue→violet glow, floating orbs, orbital dashes. Three ways, best first:

### Route A — Three.js / WebGL (recommended; most on-brand, no slop, animated)
The site already vendors three.js for the demos. Build `components/HeroStack.tsx`:
- 4–5 stacked `RoundedBoxGeometry` slabs, `MeshPhysicalMaterial` with
  `transmission:1, thickness, roughness:.15, ior:1.3, clearcoat` → real frosted
  glass with internal refraction (exactly the mockup look).
- Emissive lightning bolt (extruded SVG path) on top; `UnrealBloomPass` for glow.
- Instanced small spheres = the floating orbs; a `LineDashedMaterial` ellipse =
  orbital ring. Slow auto-rotate + parallax on pointer.
- Renders transparent over the page wash; re-tints per theme via light color.
- Cost: highest effort, highest payoff. Reuse the demos' renderer setup.

### Route B — CSS/SVG isometric (lighter, tiny, fully static-safe)
Stack 4 parallelograms (`transform: rotateX(58deg) rotateZ(45deg)`), each a
`linear-gradient` glass fill with `backdrop-filter` and layered `box-shadow`
edges; bolt = SVG with a `blur` glow; orbs/rings from §3.3. ~5 KB, themeable,
no WebGL. Approximates the refractive look (less "real glass" than Route A).

### Route C — AI-generated PNG (fastest; accept the tradeoffs)
Transparent PNG @1x/@2x. Downsides: fixed resolution, needs **two renders**
(light + dark) or a theme-neutral one, and it's the slop-risk route — mitigate
with the tight palette + negative prompts in §5. Use only if A/B are out of scope.

**Recommendation:** Route A for the finished site; Route B as the ship-now
fallback; keep C's prompts on hand for a quick placeholder.

---

## 5. AI image prompts (for the hero and any decor you choose to generate)

For an image model that outputs transparent PNG. Every prompt: lock the palette,
name the aesthetic, and add a negative list. Render at ≥2048px square, export
transparent, downscale for @2x.

### 5.1 Hero — glass database stack (primary)
```
Isometric 3D render of a stack of five translucent frosted-glass slabs forming a
database tower, floating. A glowing lightning bolt emblem sits on the top slab.
Material: frosted glass with soft internal refraction and subtle edge highlights.
Color palette ONLY: electric blue #3B82F6 to violet #8B5CF6 gradient, cool white
highlights. Soft studio lighting, gentle bloom, a few small floating glass
spheres nearby. Clean, premium SaaS product render, Linear/Framer aesthetic,
minimal. Centered. Transparent background, PNG.
--- negative: text, letters, numbers, logos, watermark, UI, drop shadow on
background, photorealistic office, clutter, busy, rainbow colors, orange, green,
neon overload, low-poly, cartoon, grain, noisy background.
```
Variant knobs: "hexagonal slabs" (echo the logo) · "thicker glass, more
refraction" · "cooler, more blue" vs "more violet" · orbit ring: add
"a thin dashed elliptical orbit ring around the tower."

### 5.2 Floating orbs / particle set (optional — CSS does this fine)
```
A set of small translucent glass spheres and soft blurred bokeh orbs, blue #3B82F6
to violet #8B5CF6, cool white speculars, various sizes, scattered. Soft studio
light. Transparent background, PNG. --- negative: text, background, harsh shadows,
rainbow, realistic photo, faces.
```

### 5.3 Background mesh (optional — CSS gradient is lighter)
```
Very soft abstract gradient mesh, white to pale lavender #EEF0FF with faint blue
and violet blooms, extremely subtle, no focal point, flat, seamless. Full-bleed.
--- negative: objects, text, hard edges, high contrast, grain, saturated colors.
```

**Model tips:** Midjourney → append `--style raw --ar 1:1` and use an
erase-background/transparent export; SDXL/Ideogram → set transparent output;
always generate the hero **twice** (light + dark surround) unless the render is
truly theme-neutral. Reject any output with baked-in text or shadow.

---

## 6. Build order & file map (in `origindb-site/`)

1. **Tokens** → add the §1 light-theme vars to `app/globals.css` (theme block).
2. **Logo** → `components/Logo.tsx` (mark + wordmark).
3. **Icons** → extend `components/IconSprite.tsx` with the 12 new symbols; render via existing `components/Icon.tsx`.
4. **Decor** → `components/HeroDecor.tsx` (orbs + orbital rings) + globals wash/grain + CTA blob CSS.
5. **Hero** → `components/HeroStack.tsx` (Route A three.js, or B CSS) — the floating glass feature cards are CSS around it.
6. **Trust logos** → drop official SVGs into `public/logos/` (only real users; otherwise cut the strip or relabel "Built with").
7. **Assemble** → rebuild `app/page.tsx` sections to the mockup; wire `next/image` only if any raster (hero Route C) is used.

**Definition of done:** every asset crisp at 2×, correct in light AND dark,
palette-locked to §1, total added weight < ~60 KB if hero is vector (Route A/B),
and no third-party logo drawn from memory.
