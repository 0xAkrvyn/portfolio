# AKRVYENSEC — Next.js + TypeScript + shadcn/ui

Conversion of the original static HTML/daisyUI site to Next.js 15 (App Router), TypeScript, Tailwind v4 and shadcn/ui.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure
```
src/
  app/
    layout.tsx            root layout (Share Tech Mono font, data provider, toaster)
    globals.css           neon-terminal theme (shadcn CSS variables)
    (site)/               public pages with header + footer
      page.tsx            home (hero + animated terminal)
      about/ services/ tools/ blog/ contact/
    admin/page.tsx        admin panel (/admin)
    robots.ts, sitemap.ts replaces robots.txt / sitemap.xml
  components/
    ui/                   shadcn components (+ native-select)
    site/                 public-site components
    admin/                admin panel (login, sections, confirm dialog)
  lib/
    types.ts              SiteData types
    default-data.ts       DEFAULT_DATA (was data.js)
    store.tsx             React context: localStorage load/save + admin session
    helpers.ts            formatDate, estimateReadTime, ...
```

## Notes
- Content works exactly like before: defaults live in `src/lib/default-data.ts`, admin edits are saved to
  `localStorage` (key `akrvyensec_data`). Export JSON from Admin → Settings and paste into `DEFAULT_DATA`
  to publish changes for all visitors.
- Formspree ID can be overridden with `NEXT_PUBLIC_FORMSPREE_ID` in `.env.local`.
- ⚠️ The admin login is client-side only (same as the original) — fine for a personal demo, but not real security.
  For production, move content + auth to a backend (e.g. a database + NextAuth / route handlers).
- Old `.html` URLs: add redirects in `next.config.ts` if you need them (see below).
