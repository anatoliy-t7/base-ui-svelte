<script lang="ts">
	import { NavigationMenu } from '../src/navigation-menu/index.js';
</script>

<NavigationMenu.Root data-testid="root">
	<NavigationMenu.List data-testid="list">
		<NavigationMenu.Item value="products">
			<NavigationMenu.Trigger data-testid="products-trigger">
				Products
				<NavigationMenu.Icon data-testid="icon" />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<div data-testid="products-content">Products panel</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item value="company">
			<NavigationMenu.Trigger data-testid="company-trigger">Company</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<div data-testid="company-content">Company panel</div>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item value="docs">
			<NavigationMenu.Link href="/docs" data-testid="docs-link">Docs</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
	<NavigationMenu.Portal>
		<NavigationMenu.Backdrop data-testid="backdrop" />
		<NavigationMenu.Positioner>
			<NavigationMenu.Popup data-testid="popup">
				<NavigationMenu.Arrow data-testid="arrow" />
				<NavigationMenu.Viewport data-testid="viewport" />
			</NavigationMenu.Popup>
		</NavigationMenu.Positioner>
	</NavigationMenu.Portal>
</NavigationMenu.Root>
