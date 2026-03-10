# Portfolio

Simple dark-themed portfolio built with Next.js 14, HeroUI, Lucide Icons.

## Stack

- **Next.js 14** (App Router)
- **HeroUI** — component library
- **Lucide React** — icons
- **Tailwind CSS** — styling

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Customise

Edit `app/page.tsx`:

- **Name / bio** — Hero section at the top
- **Skills** — `SKILLS` array
- **Projects** — `PROJECTS` array
- **Contact email** — `href="mailto:..."` in the Contact section
- **Social links** — `href="#"` on the icon buttons in the Hero section

## Color Palette

| Token     | Hex       | Usage                  |
|-----------|-----------|------------------------|
| `bg`      | `#232323` | Page background        |
| `surface` | `#2c2c2c` | Cards                  |
| `border`  | `#3a3a3a` | Dividers, card borders |
| `muted`   | `#888888` | Secondary text         |
| `accent`  | `#e2c882` | Highlights, CTAs       |
