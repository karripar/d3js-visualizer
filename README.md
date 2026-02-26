# Aspect — Visual CV

A modern **Next.js** app to build and share a visual professional profile. Users fill a simple form, rate up to eight skills, and get a shareable public profile URL. Skill proficiency is rendered with clean visual charts using **D3.js**.

---

##  Core Features

- **Landing page** with CTA and demo profile
- **Profile creator** at `/new` with:
  - Personal info, role, summary
  - Projects and highlights
  - Up to **8 skills** with 1–10 ratings
- **Public profile pages** at `/p/[slug]`
  - Shareable URL
  - Responsive layout
  - D3-based skill chart
- **Profile dashboard** at `/profile`
  - List your created resumes
  - Create, update, and delete profiles
  - Simple quota logic (e.g. max 3 resumes per user)
- **Authentication (optional)**
  - Google sign-in via Supabase
  - Centralized `AuthContext` + `useAuth` hook
- **Supabase data layer (optional)**
  - Profiles stored in Supabase `profiles` table
  - Helper hooks for CRUD operations
- **Clean UI** with Tailwind CSS v4
- **Type-safe** via TypeScript

---

##  Architecture Overview

### App Router Structure

- `src/app/page.tsx` – Landing page
- `src/app/new/page.tsx` – Create profile
- `src/app/p/[slug]/page.tsx` – Public profile page
- `src/app/profile/page.tsx` – Profile dashboard (list + actions)
- `src/app/profile/update/[slug]/page.tsx` – Update existing profile
- `src/app/login/page.tsx` – Login / auth entry
- `src/app/layout.tsx` – Root layout and global providers

### Key Modules

- **Auth Context & Hooks**

  - `src/context/AuthContext.tsx`
    - Wraps the app with a Supabase-aware auth provider
    - Listens for `onAuthStateChange` events
    - Exposes `user`, `session`, and basic auth helpers
  - `src/hooks/useAuth.tsx`
    - Thin wrapper: `export function useAuth() { return useAuthContext(); }`
    - Used in pages like `/profile` to access current user without re-querying Supabase.

- **Supabase Client & Data Hooks**

  - `src/lib/supabase.ts`
    - Creates a browser Supabase client with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `src/hooks/supabaseHooks.ts`
    - Encapsulates common operations, e.g.:
      - Create profile (insert into `profiles`)
      - Fetch by `slug`
      - Update profile
      - Delete profile
    - Keeps Supabase logic out of UI components.

- **UI & Forms**

  - `components/form/profileForm.tsx` – Main create form
  - `components/form/updateForm.tsx` – Edit form
  - `components/form/Projects.tsx`, `components/form/Skills.tsx` – Form sections
  - `components/profile/ProfileCard.tsx`, `ProjectsCard.tsx` – Public profile layout
  - `components/skillChart.tsx` – D3-based skill visualization

- **Navigation & Layout**
  - `components/nav/UniversalNav.tsx` – Top navigation
  - `components/nav/AuthTab.tsx` – Login/account entry
  - `components/nav/BackButton.tsx` – Consistent back navigation
  - `components/BottomBar.tsx` – Tech stack icon bar

---

##  Authentication & Authorization

Authentication is **optional but integrated**. When enabled:

- **Supabase** manages sessions and OAuth (e.g. Google).
- `AuthContext` subscribes to Supabase auth state and exposes:
  - `user` – current authenticated user (or `null`)
  - `session` – Supabase session object
  - helper methods like `signInWithGoogle`, `signOut` (see actual context for exact API)
- Components access auth via the `useAuth` hook:

```ts
import { useAuth } from "@/hooks/useAuth";

const { user } = useAuth();

if (!user) {
  // show login CTA / redirect
}
```

### Auth UI

- `components/auth/GoogleLogin.tsx`
  - Renders a button linked to Supabase Google OAuth.
  - Typically used on `/login` or embedded in the landing page.

### Route Usage Examples

- `/profile` uses `useAuth` to:
  - Get `user.id` and `user.email`
  - Show the user’s resumes from Supabase
  - Limit actions when not authenticated

---

##  Supabase Data Model

Supabase is used as a hosted Postgres backend. The schema is defined in:

- `supabase/schemas/schema.sql`

The main table is typically:

- `profiles`
  - `id` – primary key
  - `user_id` – Supabase auth user ID
  - `slug` – unique public URL segment
  - `name`, `title`, `summary`
  - `skills` / `projects` fields (see schema for exact structure)

Data operations are funneled through:

- `src/hooks/supabaseHooks.ts`
  - `createProfile`
  - `getProfileBySlug`
  - `updateProfile`
  - `deleteProfile`
- Pages like `/new`, `/profile`, `/profile/update/[slug]` consume these hooks for a thin UI layer.

Session storage is also used to **cache resumes locally**, reducing Supabase reads, even though the API quota is generous.

---

##  D3 Skill Visualization

- `components/skillChart.tsx` is a client-only component (`"use client"`).
- Receives normalized skill data and renders a chart using **D3.js**.
- Integrated into public profile pages so visitors see a quick visual of strengths.

You can extend this chart with:

- Animations or transitions
- Different chart types (radar, bar, etc.)
- Tooltips on hover

---

##  Tech Stack

- **Next.js 16**, **React 19** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (via PostCSS)
- **D3.js** for charts
- **Three.js** (installed, optional for 3D visuals)
- **Supabase JS SDK**
- **ESLint 9**

---

##  Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. Open **http://localhost:3000** in your browser.

---

##  NPM Scripts

- `npm run dev` – Start Next.js in development
- `npm run build` – Production build
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

---

##  Environment Variables

If you use Supabase, add these to `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_OAUTH_CLIENT_ID`

- Acquire the required Supabase credentials by creating a project at [Supabase](https://supabase.com)
- Additionally you need to create an Oauth client ID if you wish to use Google's authentication. See more at [Google](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id/)

See:

- `src/lib/supabase.ts`
- `src/hooks/supabaseHooks.ts`
- `src/context/AuthContext.tsx`

---

##  Project Structure (simplified)

- `public/` – Static assets and icons
- `src/app/` – Next.js App Router pages and layout
- `src/components/` – UI components and charts
- `src/context/` – AuthContext provider
- `src/hooks/` – Auth and Supabase hooks
- `src/lib/` – Supabase client
- `src/types/` – Local TypeScript types
- `supabase/` – Database schema

---

##  Notes

- React 19 and Next 16 require a recent Node.js version.
- D3 charts must be rendered client-side (`"use client"`).
- Three.js is available for future 3D features but not required.

---

##  License

Proprietary. Do not distribute without permission.
