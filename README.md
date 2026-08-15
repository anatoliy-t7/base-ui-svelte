# Base UI Svelte

Unofficial Svelte 5 port of [Base UI](https://base-ui.com).

**This project is not affiliated with MUI or the Base UI team.** It reimplements Base UI–inspired APIs and accessibility behavior for Svelte 5.

## Install

```bash
bun add base-ui-svelte
```

Peer dependency: `svelte` `^5`.

## Quick start

```svelte
<script lang="ts">
  import { Popover } from 'base-ui-svelte/popover';
</script>

<Popover.Root>
  <Popover.Trigger>Notifications</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner sideOffset={8}>
      <Popover.Popup>
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>You are all caught up.</Popover.Description>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

### Stacking / portals

Add these global styles so portaled popups stay above page content (same guidance as [Base UI quick start](https://base-ui.com/react/overview/quick-start)):

```css
body {
  position: relative;
}

.root {
  isolation: isolate;
}
```

Wrap your app:

```html
<body>
  <div class="root">{/* app */}</div>
</body>
```

## Components

| Component | Import |
|-----------|--------|
| Accordion | `base-ui-svelte/accordion` |
| Alert Dialog | `base-ui-svelte/alert-dialog` |
| Autocomplete | `base-ui-svelte/autocomplete` |
| Avatar | `base-ui-svelte/avatar` |
| Button | `base-ui-svelte/button` |
| Checkbox | `base-ui-svelte/checkbox` |
| Checkbox Group | `base-ui-svelte/checkbox-group` |
| Collapsible | `base-ui-svelte/collapsible` |
| Combobox | `base-ui-svelte/combobox` |
| Context Menu | `base-ui-svelte/context-menu` |
| Dialog | `base-ui-svelte/dialog` |
| Drawer | `base-ui-svelte/drawer` |
| Field | `base-ui-svelte/field` |
| Fieldset | `base-ui-svelte/fieldset` |
| Form | `base-ui-svelte/form` |
| Input | `base-ui-svelte/input` |
| Menu | `base-ui-svelte/menu` |
| Menubar | `base-ui-svelte/menubar` |
| Meter | `base-ui-svelte/meter` |
| Navigation Menu | `base-ui-svelte/navigation-menu` |
| Number Field | `base-ui-svelte/number-field` |
| OTP Field | `base-ui-svelte/otp-field` |
| Popover | `base-ui-svelte/popover` |
| Preview Card | `base-ui-svelte/preview-card` |
| Progress | `base-ui-svelte/progress` |
| Radio | `base-ui-svelte/radio` |
| Radio Group | `base-ui-svelte/radio-group` |
| Scroll Area | `base-ui-svelte/scroll-area` |
| Select | `base-ui-svelte/select` |
| Separator | `base-ui-svelte/separator` |
| Slider | `base-ui-svelte/slider` |
| Switch | `base-ui-svelte/switch` |
| Tabs | `base-ui-svelte/tabs` |
| Toast | `base-ui-svelte/toast` |
| Toggle | `base-ui-svelte/toggle` |
| Toggle Group | `base-ui-svelte/toggle-group` |
| Toolbar | `base-ui-svelte/toolbar` |
| Tooltip | `base-ui-svelte/tooltip` |

### Utilities / providers

| Utility | Import |
|---------|--------|
| Direction Provider | `base-ui-svelte/direction-provider` |
| CSP Provider | `base-ui-svelte/csp-provider` |
| mergeProps | `base-ui-svelte/merge-props` |

Also available from the root barrel: `import { Dialog, createToastManager, mergeProps } from 'base-ui-svelte'`.

## Development

```bash
bun install
bun run test
bun run build
bun run dev
```

## License

MIT
