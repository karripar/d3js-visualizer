# Aspect — Visual CV

A Next.js app to build and share a visual professional profile. Users fill a simple form, rate up to eight skills, and get a shareable profile URL. Skill proficiency is rendered with clean visual charts using D3.js.

## Features

- Landing page with CTA and demo profile
- Profile generator at /new
- Public profile pages at /p/[slug]
- Visual skill charts (D3.js)
- Clean, modern UI with Tailwind CSS
- Optional Supabase integration hooks for auth/data

## Tech Stack

- Next.js 16, React 19
- TypeScript
- Tailwind CSS v4 (postcss)
- D3.js for charts
- Three.js (available for 3D visuals)
- Supabase JS SDK
- ESLint 9

## Getting Started

1. Install dependencies
   - npm install
2. Run the dev server
   - npm run dev
3. Open http://localhost:3000

## Scripts

- dev: Start Next.js in development
- build: Production build
- start: Start production server
- lint: Run ESLint

## Environment Variables

If you use Supabase, add these to .env.local:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

See src/lib/supabase.ts and src/hooks/supabaseHooks.ts.

## Key Routes

- / — Landing page (src/app/page.tsx)
- /new — Create a profile (src/app/new/page.tsx)
- /p/[slug] — View a public profile (src/app/p/[slug]/page.tsx)
- /profile — Profile view/editor (src/app/profile/page.tsx)

## Notable Components

- components/BottomBar.tsx — Tech icons bar
- components/skillChart.tsx — D3-based skill visualization
- components/form/profileForm.tsx — Profile form
- components/auth/GoogleLogin.tsx — Google auth UI
- components/nav/\* — Navigation helpers

## Data

- src/data/profile.json — Example profile data
- supabase/schemas/schema.sql — Database schema (if using Supabase)

## Project Structure (simplified)

- public/ — Static assets and icons
- src/app/ — Next.js App Router pages and layout
- src/components/ — UI components and charts
- src/hooks/ — Auth and Supabase hooks
- src/lib/ — Supabase client
- src/types/ — Local TypeScript types

## Styling

- Tailwind CSS v4 enabled via postcss.config.mjs and globals.css
- Utility-first classes used throughout the app

## Deployment

- Build: npm run build
- Start: npm run start
- Configure environment variables on your hosting provider (Vercel recommended)

## Notes

- React 19 and Next 16 require up-to-date Node.js.
- D3 charts should be rendered client-side ("use client").
- Three.js is installed but optional; use for future 3D visuals.
- Session storage is used to cache resumes to reduce Supabase storage API calls even though they are unlimited.

## License

Proprietary. Do not distribute without permission.
