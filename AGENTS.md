# AGENTS.md

Unofficial Svelte 5 port of [Base UI](https://base-ui.com). Unstyled, accessible compound components. **Not affiliated with MUI / Base UI.** Match Base UI React APIs and a11y behavior unless Svelte requires a deliberate divergence.

## Repo layout

| Path                               | Role                                                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `packages/svelte`                  | Library (`base-ui-svelte`) — headless source of truth                                                             |
| `packages/styles`                  | Optional styles (`@base-ui-svelte/styles`) — Tailwind CSS v4 + `tv` recipes                                       |
| `packages/svelte/src/<component>/` | One folder per component                                                                                          |
| `packages/svelte/src/internal/`    | Shared primitives (context keys, mergeProps, floating, presence, focus trap, dismiss, controllable state, portal) |
| `packages/svelte/tests/`           | Vitest + Testing Library (+ vitest-axe)                                                                           |
| `apps/docs`                        | Docs site + demos (SvelteKit)                                                                                     |

Package manager: **Bun** (workspaces). Node `>=22`.

## Commands

Run from monorepo root:

```bash
bun install
bun run test          # packages/svelte vitest
bun run check         # styles typecheck + svelte-check (library + docs)
bun run build         # styles tsc + svelte-package → dist
bun run docs:build    # static docs → apps/docs/build (set PUBLIC_SITE_ORIGIN)
bun run publint       # validate publishable packages
bun run fmt           # oxfmt (whole monorepo)
bun run fmt:check     # oxfmt --check
bun run lint          # oxlint (whole monorepo)
bun run lint:fix      # oxlint --fix
bun run dev           # docs
```

Scoped:

```bash
bun run --filter base-ui-svelte test:watch
bun run --filter base-ui-svelte check
bun run --filter @base-ui-svelte/styles build
```

After changing library APIs or exports, rebuild before relying on docs/consumers of `dist`.

## Component conventions

Mirror Base UI public APIs:

- **Single-part** (Button, Input, Separator, Toggle, Form, CheckboxGroup, RadioGroup, ToggleGroup, Menubar, …): export the component directly — `<Button />`, not `<Button.Root>`.
- **Compound**: namespace object with parts, including `Root`:

```ts
// packages/svelte/src/popover/index.ts
export const Popover = { Root, Trigger, Portal, Positioner, Popup /* … */ };
```

Per component folder:

- `*-root.svelte`, `*-trigger.svelte`, … — parts
- `types.ts` — props + context types
- `index.ts` — direct component export (single-part) or namespace object (compound) + re-exported types

Also wire:

1. Subpath export in `packages/svelte/package.json` (`./popover`, etc.)
2. Root barrel in `packages/svelte/src/index.ts`
3. Context `Symbol` in `packages/svelte/src/internal/context-keys.ts` (`base-ui-svelte.<name>`)
4. Docs route under `apps/docs/src/routes/<component>/` when adding a user-facing demo
5. Tests: `packages/svelte/tests/<name>.test.ts` + `<name>.test.svelte`

### Patterns to follow

- **Svelte 5 runes only** — `$props`, `$state`, `$derived`, `$bindable`, `$effect` (sparingly). No stores for component state.
- **Headless / unstyled** — no visual CSS in the library; expose `data-*` hooks (`data-open`, `data-closed`, `data-disabled`, `data-orientation`, …) like Base UI.
- **Props** — extend appropriate `svelte/elements` HTML attribute types; omit colliding keys (`children`, `role`, …) when needed. Use `Snippet` for children; render-prop snippets where Base UI exposes render state.
- **Controlled / uncontrolled** — `value` / `open` / `checked` as `$bindable(undefined)`, plus `default*` and `on*Change`. Prefer `createControllableOpen` / helpers from `internal/controllable.svelte.ts` when applicable.
- **Context** — `setContext` / `getContext` with symbols from `context-keys.ts`. Expose reactive fields via getters on the context object.
- **DOM props** — always `mergeProps` from `internal/merge-props.ts` so `class` concatenates and `on*` handlers compose. Spread merged props onto the host element.
- **Portals / overlays** — `Portal` + `Positioner` + `Popup` pattern; positioning via `createPositioner` (`@floating-ui/dom`). Use `createPresence`, `createDismiss`, `createFocusTrap` as existing overlays do.
- **IDs** — `useId('prefix')` for stable a11y relationships (`aria-controls`, labelled-by, etc.).
- **Imports** — use `.js` extensions in TypeScript imports (`./types.js`, `../internal/merge-props.js`) for `verbatimModuleSyntax` / bundler resolution.
- **Naming** — kebab-case file names (`accordion-trigger.svelte`); PascalCase component namespace parts (`Accordion.Trigger`).

### TypeScript

- `strict` + `exactOptionalPropertyTypes` — treat optional props carefully (`T | undefined` when needed).
- Prefer `unknown` over `any`. No enums; use string unions.
- Validate external/untrusted data with Zod if introduced; do not use type assertions for that.

## Testing

- Colocate a minimal harness `.test.svelte` that composes the public namespace API.
- Cover open/close (or checked) behavior, keyboard where relevant, controlled/`default*` props, and **axe** (`vitest-axe`) on representative open states.
- Environment: happy-dom via `packages/svelte/vite.config.ts`.

## Svelte / docs tooling

When writing or editing `.svelte` / `.svelte.ts` files:

1. Use Svelte MCP / `@sveltejs/mcp` docs for runes and APIs you are unsure about.
2. Run `svelte-autofixer` (MCP or CLI) on new/changed components before finishing.
3. Prefer `$derived` over syncing state in `$effect`.

## Boundaries

### Always

- Keep components unstyled and accessible (correct roles, ARIA, focus management).
- Prefer matching Base UI part names, props, and data attributes.
- Reuse `packages/svelte/src/internal/*` instead of reimplementing floating, dismiss, presence, or merge logic.
- Update exports (`package.json` + root `index.ts`) when adding a component.
- Put visual styles in `packages/styles` (`@base-ui-svelte/styles`), not in the headless package.

### Ask first

- Public API breaks or renames.
- New runtime dependencies (beyond `@floating-ui/dom` / peer `svelte`).
- Publishing, version bumps, or changelog process changes.
- Large refactors of `internal/` shared primitives.

### Release notes

- Docs are static (`@sveltejs/adapter-static`); deploy `apps/docs/build` or `apps/docs/Dockerfile` via Dokploy.
- Set `PUBLIC_SITE_ORIGIN` at docs build time for absolute SEO / sitemap / llms.txt URLs.
- Publish `base-ui-svelte` and `@base-ui-svelte/styles` from `packages/*` after `bun run build` + `bun run publint` (see root README).

### Never

- Add default visual styling or design-system CSS to the library package.
- Claim official affiliation with MUI / Base UI in docs or package metadata.
- Commit secrets, force-push main, or skip git hooks unless explicitly requested.
- Use `any`, `@ts-ignore` without a justifying comment, or Svelte 4 syntax (`export let`, `on:click`).

## Reference implementations

When adding or changing a component, copy structure from the closest existing peer:

| Kind         | Example                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| Disclosure   | `accordion`, `collapsible`                                                 |
| Dialog-like  | `dialog`, `alert-dialog`, `drawer`                                         |
| Floating     | `popover`, `tooltip`, `preview-card`, `menu`                               |
| Form control | `checkbox`, `switch`, `radio`, `slider`, `field`, `input`, `number-field`  |
| Collection   | `tabs`, `toggle-group`, `select`, `combobox`, `autocomplete`               |
| Navigation   | `menubar`, `navigation-menu`, `toolbar`                                    |
| Utilities    | `direction-provider`, `csp-provider`, `merge-props`                        |
| Styles       | `packages/styles` (`btn btn-sm`, `{component}-{part}`, Tailwind v4 + `tv`) |
