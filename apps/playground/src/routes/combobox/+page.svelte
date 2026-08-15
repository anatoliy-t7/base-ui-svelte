<script lang="ts">
	import { Combobox } from 'base-ui-svelte/combobox';
	import '../demo.css';
</script>

<h1>Combobox</h1>
<div class="demo">
	<Combobox.Root>
		<div class="sep-row">
			<Combobox.Input class="combo-input" placeholder="Search fruit…" aria-label="Fruit" />
			<Combobox.Trigger class="btn">▾</Combobox.Trigger>
		</div>
		<Combobox.Portal>
			<Combobox.Positioner sideOffset={4}>
				<Combobox.Popup class="menu-popup">
					<Combobox.List>
						<Combobox.Item class="menu-item" value="apple">Apple</Combobox.Item>
						<Combobox.Item class="menu-item" value="banana">Banana</Combobox.Item>
						<Combobox.Item class="menu-item" value="cherry">Cherry</Combobox.Item>
						<Combobox.Item class="menu-item" value="date">Date</Combobox.Item>
					</Combobox.List>
					<Combobox.Empty class="menu-empty">No matches</Combobox.Empty>
				</Combobox.Popup>
			</Combobox.Positioner>
		</Combobox.Portal>
	</Combobox.Root>
</div>
