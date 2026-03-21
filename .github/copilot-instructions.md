# GitHub Copilot Instructions

## Project overview
- This is a Vue 3 + TypeScript project built with Vite.
- Styling uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin and `src/assets/main.css`.

## Package manager
- Always use `npm` for dependency installation and script execution in this repository.
- Prefer `npm install`, `npm run <script>`, and `npx <tool>` when needed.
- Do not introduce `pnpm` commands, `pnpm-lock.yaml`, or other package-manager-specific files unless the user explicitly asks for that change.
- Keep `package-lock.json` as the lockfile for dependency updates.

## Validation
- When validating code changes, prefer the existing project scripts:
  - `npm run build`
  - `npm run lint`
  - `npm run test:unit -- --run`

## Editing guidance
- Make precise changes that fit the existing Vue + Vite structure.
- Reuse the existing app entrypoint in `src/main.ts` for global stylesheet imports.
- Avoid unrelated cleanup or tooling changes unless they are required for the requested task.
