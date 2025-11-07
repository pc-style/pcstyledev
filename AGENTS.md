# Repository Guidelines

## Project Structure & Module Organization
Next.js App Router code sits in `src/`. Keep routed entries, metadata, and server actions in `src/app`, shared UI in `src/components`, helpers in `src/lib`, and types in `src/types`. Project data lives in `data/projects.json`, while static imagery and fonts belong in `public/`. Use `docs/` for deep dives or briefs.

## Build, Test, and Development Commands
- `npm run dev` — start the local dev server with React Compiler hot refresh.
- `npm run build` — compile the production bundle used by Vercel.
- `npm run start` — run the built bundle locally for pre-release smoke tests.
- `npm run lint` — check TypeScript, accessibility, and Next best practices; run before pushing.

## Coding Style & Naming Conventions
Write modern TypeScript, prefer functional React components, and remain server-first unless client interactivity demands otherwise. Default to 2-space indentation, PascalCase component filenames (`ProjectsGrid.tsx`), camelCase utilities, and SCREAMING_SNAKE_CASE config tokens. Tailwind v4 utilities should handle styling; reach for custom CSS only when a design cannot be expressed with utilities. Configuration files stay as ES modules (`.mjs`) to match the existing toolchain.

## Testing Guidelines
No runner ships in the repo today, so add coverage when behaviour exceeds purely presentational work. Use Jest or Vitest with React Testing Library, placing specs alongside components (`Component.test.tsx`) or under `src/__tests__/`. For interactive flows (cursor effects, SSH contact modal), supplement with manual smoke tests in `npm run start` or introduce Playwright page specs. Document manual steps and expected outcomes in the PR until automation exists.

## Commit & Pull Request Guidelines
Commit history mixes Conventional Commits with plain imperatives; adopt the conventional style going forward (`feat:`, `fix:`, `chore:`) to clarify intent. Keep commits scoped, reference related issues, and explain design or SEO adjustments in the body. PRs should outline the change, link demos or screenshots for UI tweaks, list manual test notes, and call out follow-up tasks (metrics, content sync) before requesting review.

## Deployment & Configuration Notes
Deployments target Vercel and honour headers, redirects, and caching rules in `vercel.json`. Manage secrets via the Vercel dashboard—do not commit `.env` artifacts. When adjusting performance knobs, update both `next.config.ts` and `vercel.json` to stay in sync.
