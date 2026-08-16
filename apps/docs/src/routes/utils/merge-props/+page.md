---
title: mergeProps
description: Compose DOM props for Svelte — class concatenation and on* handler chaining.
---

Import from `base-ui-svelte/merge-props` (also on the root barrel). Merges `class` (not `className`) and composes `on*` handlers. See [Differences](/handbook/differences).

```ts
import { mergeProps } from 'base-ui-svelte/merge-props';

const props = mergeProps({ class: 'btn', onclick: onA }, { class: 'btn-primary', onclick: onB });
// class → "btn btn-primary"; both onclick handlers run
```

Upstream: [Base UI mergeProps](https://base-ui.com/react/utils/merge-props).
