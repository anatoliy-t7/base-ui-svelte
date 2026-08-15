<script lang="ts">
	import { Menu } from 'base-ui-svelte/menu';
	import '../demo.css';
</script>

<h1>Menu</h1>
<div class="demo">
	<Menu.Root>
		<Menu.Trigger class="btn">Song</Menu.Trigger>
		<Menu.Portal>
			<Menu.Positioner sideOffset={8} align="start">
				<Menu.Popup class="menu-popup">
					<Menu.Item class="menu-item">Add to Library</Menu.Item>
					<Menu.Item class="menu-item">Add to Playlist</Menu.Item>
					<Menu.Separator class="menu-sep" />
					<Menu.Item class="menu-item">Play Next</Menu.Item>
					<Menu.Item class="menu-item">Favorite</Menu.Item>
				</Menu.Popup>
			</Menu.Positioner>
		</Menu.Portal>
	</Menu.Root>
</div>
