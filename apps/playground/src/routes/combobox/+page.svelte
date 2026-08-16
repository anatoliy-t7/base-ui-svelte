<script lang="ts">
	import { Combobox } from 'base-ui-svelte/combobox';
</script>

<h1>Combobox</h1>

<section class="demo">
	<p class="muted">Input group keeps the chevron inside the field; popup animates open/close</p>
	<Combobox.Root>
		<Combobox.InputGroup class="combobox-input-group">
			<Combobox.Input class="combobox-input" placeholder="Search fruit…" aria-label="Fruit" />
			<Combobox.Trigger class="combobox-trigger">
				<Combobox.Icon class="combobox-icon">▾</Combobox.Icon>
			</Combobox.Trigger>
		</Combobox.InputGroup>
		<Combobox.Portal>
			<Combobox.Positioner sideOffset={4}>
				<Combobox.Popup class="combobox-popup">
					<Combobox.List>
						<Combobox.Item class="combobox-item" value="apple">Apple</Combobox.Item>
						<Combobox.Item class="combobox-item" value="banana">Banana</Combobox.Item>
						<Combobox.Item class="combobox-item" value="cherry">Cherry</Combobox.Item>
						<Combobox.Item class="combobox-item" value="date">Date</Combobox.Item>
					</Combobox.List>
					<Combobox.Empty class="combobox-empty">No matches</Combobox.Empty>
				</Combobox.Popup>
			</Combobox.Positioner>
		</Combobox.Portal>
	</Combobox.Root>
</section>
