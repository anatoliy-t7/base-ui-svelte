---
title: CSP Provider
description: Nonce / CSP helpers for environments that require Content-Security-Policy.
---

Import from `base-ui-svelte/csp-provider` when your app injects styles or scripts under a strict CSP.

Use the provider at the app root so descendants can read the configured nonce. Behavior mirrors Base UI’s CSP provider conceptually; wire it with Svelte context instead of React context.

```svelte
<script lang="ts">
	import { CspProvider } from 'base-ui-svelte/csp-provider';
</script>

<CspProvider nonce="…">
	<!-- app -->
</CspProvider>
```

Upstream: [Base UI CSP Provider](https://base-ui.com/react/utils/csp-provider).
