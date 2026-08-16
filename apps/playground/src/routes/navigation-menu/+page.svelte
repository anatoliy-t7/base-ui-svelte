<script lang="ts">
	import { NavigationMenu } from 'base-ui-svelte/navigation-menu';
</script>

<h1>Navigation Menu</h1>

<section class="demo">
	<NavigationMenu.Root class="navigation-menu">
		<NavigationMenu.List class="navigation-menu-list">
			<NavigationMenu.Item class="navigation-menu-item" value="products">
				<NavigationMenu.Trigger class="navigation-menu-trigger">Products</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<div class="navigation-menu-content">
						<p>Overview</p>
						<p>Pricing</p>
						<p>Integrations</p>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item class="navigation-menu-item" value="company">
				<NavigationMenu.Trigger class="navigation-menu-trigger">Company</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<div class="navigation-menu-content">
						<p>About</p>
						<p>Careers</p>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item class="navigation-menu-item" value="docs">
				<NavigationMenu.Link class="navigation-menu-link" href="#docs">Docs</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
		<NavigationMenu.Portal>
			<NavigationMenu.Positioner sideOffset={8}>
				<NavigationMenu.Popup class="navigation-menu-popup">
					<NavigationMenu.Viewport class="navigation-menu-viewport" />
				</NavigationMenu.Popup>
			</NavigationMenu.Positioner>
		</NavigationMenu.Portal>
	</NavigationMenu.Root>
</section>
