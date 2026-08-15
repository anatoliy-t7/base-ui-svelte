<script lang="ts">
	import { Combobox } from '../src/combobox/index.js';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' }
	];

	let value = $state<string[]>([]);
</script>

<Combobox.Root multiple items={fruits} bind:value>
	<Combobox.InputGroup data-testid="input-group">
		<Combobox.Chips data-testid="chips">
			{#each value as selected (selected)}
				<Combobox.Chip data-testid={`chip-${selected}`} value={selected}>
					{selected}
					<Combobox.ChipRemove data-testid={`remove-${selected}`} />
				</Combobox.Chip>
			{/each}
		</Combobox.Chips>
		<Combobox.Input data-testid="input" />
	</Combobox.InputGroup>
	<Combobox.Portal>
		<Combobox.Positioner>
			<Combobox.Popup data-testid="popup">
				<Combobox.List data-testid="list">
					<Combobox.Collection>
						{#snippet children(item)}
							<Combobox.Item
								data-testid={`item-${item.value}`}
								value={item.value}
								label={item.label}
							/>
						{/snippet}
					</Combobox.Collection>
				</Combobox.List>
			</Combobox.Popup>
		</Combobox.Positioner>
	</Combobox.Portal>
	<span data-testid="value">{value.join(',')}</span>
</Combobox.Root>
