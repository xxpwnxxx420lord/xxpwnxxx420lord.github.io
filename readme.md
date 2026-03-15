# xxpwnxxx420lord.github.io

A personal blog / content site built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, deployed via **Vercel**.

🔗 **Live site:** [blogpost-lyart.vercel.app](https://blogpost-lyart.vercel.app)

---

## What It Does

This is a statically-generated personal blog / GitHub Pages site. It serves written content and posts through a structured routing system, pulling data from local files and rendering them as clean, styled pages. The project follows the modern Next.js App Router pattern — each route is a folder under `app/` with its own `page.tsx`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 14](https://nextjs.org/) | React framework — App Router, file-based routing, SSG/SSR |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript (43% of the codebase) |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [PostCSS](https://postcss.org/) | CSS processing pipeline (required by Tailwind) |
| [Vercel](https://vercel.com/) | Deployment and hosting |

---

## Architecture Overview

```
Browser Request
      │
      ▼
   Vercel CDN
      │
      ▼
 Next.js App Router
  ┌───────────────┐
  │   app/        │  ← Route = folder + page.tsx
  │   components/ │  ← Shared UI
  │   lib/        │  ← Data helpers
  │   data/       │  ← Content source
  └───────────────┘
      │
      ▼
  Static HTML + JS
  (served at edge)
```

---

## Project Structure

```
.
├── app/                  # Next.js App Router — pages and layouts
├── components/           # Reusable React components
├── data/                 # Static content / post data files
├── lib/                  # Utility functions and helpers
├── messages/             # Content organized by topic/slug
│   └── roblox-exploiting-guide/
├── public/               # Static assets (images, fonts, favicons)
├── .next/                # Next.js build output (auto-generated)
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.js     # PostCSS config
└── package.json          # Dependencies and scripts
```

---

## How It Works

**Routing** — Next.js App Router maps folders inside `app/` directly to URL paths. Each folder containing a `page.tsx` becomes a live route.

**Content** — Post data lives in `data/` and `messages/`. The `lib/` utilities read and parse these files at build time, passing them as props to page components for static generation.

**Components** — Shared UI elements (headers, post cards, layout wrappers) live in `components/` and are imported wherever needed across the app.

**Styling** — Tailwind CSS classes are used directly in JSX. The `tailwind.config.ts` defines the theme (colors, fonts, breakpoints) and PostCSS handles processing during build.

**Deployment** — Pushing to `main` triggers an automatic Vercel deployment. Vercel handles CDN distribution, caching, and any serverless functions.

---

## Data Flow Diagram

```
data/ + messages/
       │
       ▼ (lib/ helpers parse at build time)
   page.tsx (App Router)
       │
       ▼
  components/ (layout, cards, nav)
       │
       ▼
  Tailwind CSS styles applied
       │
       ▼
  Static HTML output → Vercel → Browser
```

---

## Language Breakdown

- TypeScript — 43%
- JavaScript — 32%
- CSS — 25%

---

## License

No Use License – All Rights Reserved

© 2026 Johnny. All rights reserved.

This work (including all files, code, assets, and documentation) is protected by copyright. 

You may NOT, under any circumstances:
- Copy, reproduce, or distribute this work.
- Modify, adapt, or create derivative works.
- Use this work for commercial or personal purposes.
- Incorporate this work into any other project or product.

Any use of this work without explicit written permission from the copyright holder (Johnny) is strictly prohibited and may result in legal action.
