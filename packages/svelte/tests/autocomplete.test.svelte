<script lang="ts">
	import { Autocomplete } from '../src/autocomplete/index.js';
</script>

<Autocomplete.Root>
	<Autocomplete.Label data-testid="label">Fruit</Autocomplete.Label>
	<Autocomplete.InputGroup data-testid="input-group">
		<Autocomplete.Input data-testid="input" />
		<Autocomplete.Trigger data-testid="trigger" />
		<Autocomplete.Icon data-testid="icon" />
		<Autocomplete.Clear data-testid="clear" />
	</Autocomplete.InputGroup>
	<Autocomplete.Portal>
		<Autocomplete.Backdrop data-testid="backdrop" />
		<Autocomplete.Positioner>
			<Autocomplete.Popup data-testid="popup">
				<Autocomplete.Arrow data-testid="arrow" />
				<Autocomplete.Status data-testid="status">Suggestions</Autocomplete.Status>
				<Autocomplete.List data-testid="list">
					<Autocomplete.Group data-testid="group">
						<Autocomplete.GroupLabel data-testid="group-label">Citrus</Autocomplete.GroupLabel>
						<Autocomplete.Item data-testid="item-apple" value="apple" label="Apple">
							<Autocomplete.Row data-testid="row-apple">
								<Autocomplete.ItemIndicator data-testid="indicator-apple" />
								Apple
							</Autocomplete.Row>
						</Autocomplete.Item>
						<Autocomplete.Item data-testid="item-banana" value="banana" label="Banana" />
					</Autocomplete.Group>
					<Autocomplete.Separator data-testid="separator" />
					<Autocomplete.Item data-testid="item-cherry" value="cherry" label="Cherry" />
					<Autocomplete.Empty data-testid="empty">No fruits</Autocomplete.Empty>
				</Autocomplete.List>
			</Autocomplete.Popup>
		</Autocomplete.Positioner>
	</Autocomplete.Portal>
</Autocomplete.Root>
