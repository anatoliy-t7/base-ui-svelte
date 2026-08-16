<script lang="ts">
	import { Autocomplete } from 'base-ui-svelte/autocomplete';
</script>

<Autocomplete.Root>
	<Autocomplete.InputGroup class="autocomplete-input-group">
		<Autocomplete.Input class="autocomplete-input" placeholder="Search fruit…" aria-label="Fruit" />
		<Autocomplete.Trigger class="autocomplete-trigger">
			<Autocomplete.Icon class="autocomplete-icon" />
		</Autocomplete.Trigger>
	</Autocomplete.InputGroup>
	<Autocomplete.Portal>
		<Autocomplete.Positioner sideOffset={4}>
			<Autocomplete.Popup class="autocomplete-popup">
				<Autocomplete.List>
					<Autocomplete.Item class="autocomplete-item" value="apple">Apple</Autocomplete.Item>
					<Autocomplete.Item class="autocomplete-item" value="banana">Banana</Autocomplete.Item>
					<Autocomplete.Item class="autocomplete-item" value="cherry">Cherry</Autocomplete.Item>
					<Autocomplete.Item class="autocomplete-item" value="date">Date</Autocomplete.Item>
				</Autocomplete.List>
				<Autocomplete.Empty class="autocomplete-empty">No matches</Autocomplete.Empty>
			</Autocomplete.Popup>
		</Autocomplete.Positioner>
	</Autocomplete.Portal>
</Autocomplete.Root>
