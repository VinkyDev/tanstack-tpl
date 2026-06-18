<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Rules

@.agents/rules.md

# Tech Stack

TanStack Start + React 19 + Vite 8 + Tailwind 4 + Base UI/Shadcn + PostgreSQL/Drizzle.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm test` | Vitest |
| `pnpm typecheck` | TypeScript check |
| `pnpm check` | Biome lint + format |
| `pnpm generate-routes` | Regenerate TanStack Router tree |
| `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:push` / `pnpm db:studio` | Drizzle workflows |
