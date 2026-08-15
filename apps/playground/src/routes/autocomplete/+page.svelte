<script lang="ts">
	import { Autocomplete } from 'base-ui-svelte/autocomplete';
	import '../demo.css';
</script>

<h1>Autocomplete</h1>
<div class="demo">
	<Autocomplete.Root>
		<div class="sep-row">
			<Autocomplete.Input class="combo-input" placeholder="Search fruit…" aria-label="Fruit" />
			<Autocomplete.Trigger class="btn">▾</Autocomplete.Trigger>
		</div>
		<Autocomplete.Portal>
			<Autocomplete.Positioner sideOffset={4}>
				<Autocomplete.Popup class="menu-popup">
					<Autocomplete.List>
						<Autocomplete.Item class="menu-item" value="apple">Apple</Autocomplete.Item>
						<Autocomplete.Item class="menu-item" value="banana">Banana</Autocomplete.Item>
						<Autocomplete.Item class="menu-item" value="cherry">Cherry</Autocomplete.Item>
						<Autocomplete.Item class="menu-item" value="date">Date</Autocomplete.Item>
					</Autocomplete.List>
					<Autocomplete.Empty class="menu-empty">No matches</Autocomplete.Empty>
				</Autocomplete.Popup>
			</Autocomplete.Positioner>
		</Autocomplete.Portal>
	</Autocomplete.Root>
</div>
