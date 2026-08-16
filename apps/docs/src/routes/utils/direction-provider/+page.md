---
title: Direction Provider
description: Set text direction (LTR / RTL) for descendants.
---

Import from `base-ui-svelte/direction-provider` to provide reading direction through Svelte context (same role as Base UI’s Direction Provider).

```svelte
<script lang="ts">
	import { DirectionProvider } from 'base-ui-svelte/direction-provider';
</script>

<DirectionProvider direction="rtl">
	<!-- app -->
</DirectionProvider>
```

Upstream: [Base UI Direction Provider](https://base-ui.com/react/utils/direction-provider).
