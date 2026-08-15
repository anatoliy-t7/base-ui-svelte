<script lang="ts">
	import { NavigationMenu } from 'base-ui-svelte/navigation-menu';
	import '../demo.css';
</script>

<h1>Navigation Menu</h1>
<div class="demo">
	<NavigationMenu.Root class="nav-menu">
		<NavigationMenu.List class="nav-list">
			<NavigationMenu.Item value="products">
				<NavigationMenu.Trigger class="btn">Products</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<div class="nav-panel">
						<p>Overview</p>
						<p>Pricing</p>
						<p>Integrations</p>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="company">
				<NavigationMenu.Trigger class="btn">Company</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<div class="nav-panel">
						<p>About</p>
						<p>Careers</p>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="docs">
				<NavigationMenu.Link class="btn" href="#docs">Docs</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
		<NavigationMenu.Portal>
			<NavigationMenu.Positioner sideOffset={8}>
				<NavigationMenu.Popup class="menu-popup nav-popup">
					<NavigationMenu.Viewport />
				</NavigationMenu.Popup>
			</NavigationMenu.Positioner>
		</NavigationMenu.Portal>
	</NavigationMenu.Root>
</div>
