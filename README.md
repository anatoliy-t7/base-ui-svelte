# Base UI Svelte

<p align="center">
  <img src="apps/docs/static/logo.svg" alt="base-ui-svelte" width="280" />
</p>

Unofficial Svelte 5 port of [Base UI](https://base-ui.com). An unstyled UI component library for building accessible user interfaces.

**Not affiliated with MUI or the Base UI team.**

---

## Install

```bash
bun add base-ui-svelte
# optional styles (Tailwind CSS v4)
bun add @base-ui-svelte/styles tailwindcss
```

```bash
npm i base-ui-svelte
npm i @base-ui-svelte/styles tailwindcss
```

## Documentation

- Local docs site: `bun run dev` (from the monorepo root)
- Source docs: [apps/docs](apps/docs)

## Contributing

Read [AGENTS.md](/AGENTS.md) to learn about the development process, how to propose bug fixes and improvements, and how to build and test your changes.

## Releases

### Publish packages to npm

Packages:

| Package | Path | Notes |
| --- | --- | --- |
| `base-ui-svelte` | `packages/svelte` | Unscoped |
| `@base-ui-svelte/styles` | `packages/styles` | Requires npm org `@base-ui-svelte` (create once on npmjs) |

```bash
# 1. Log in (once)
npm login

# 2. Create the scoped org if needed: https://www.npmjs.com/org/create
#    (for @base-ui-svelte/styles)

# 3. Build + validate
bun install
bun run test
bun run check
bun run build
bun run publint

# 4. Bump versions in packages/*/package.json when needed, then publish
cd packages/svelte && npm publish --access public
cd ../styles && npm publish --access public
```

Dry-run a tarball without publishing:

```bash
bun run release:pack
```

### Deploy docs (static) via Dokploy

Docs use `@sveltejs/adapter-static`. Output directory: `apps/docs/build`.

**Option A — Docker (recommended in Dokploy)**

1. Create a Dokploy Compose/Docker application with context at the monorepo root.
2. Dockerfile: `apps/docs/Dockerfile`
3. Build arg / env: `PUBLIC_SITE_ORIGIN=https://your-docs-domain` (no trailing slash)
4. Expose port `80`

Or locally:

```bash
docker build -f apps/docs/Dockerfile \
  --build-arg PUBLIC_SITE_ORIGIN=https://your-docs-domain \
  -t base-ui-svelte-docs .
docker run --rm -p 3000:80 base-ui-svelte-docs
```

**Option B — Static build artifact**

```bash
PUBLIC_SITE_ORIGIN=https://your-docs-domain bun run build
PUBLIC_SITE_ORIGIN=https://your-docs-domain bun run docs:build
```

Point Dokploy (or nginx) at `apps/docs/build`. Use `try_files $uri $uri/ $uri/index.html` (see `apps/docs/nginx.conf`).

See the latest updates on [GitHub Releases](https://github.com/anatoliy-t7/base-ui-svelte/releases).

## Community

- **GitHub** For support, questions, and pull requests, use [Issues](https://github.com/anatoliy-t7/base-ui-svelte/issues) in this repository.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
