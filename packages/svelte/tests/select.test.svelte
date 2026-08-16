<script lang="ts">
	import { Select } from '../src/select/index.js';

	let {
		disabled = false,
		defaultValue,
		defaultOpen = false,
		value = undefined as string | null | undefined,
		onValueChange,
		onOpenChange,
	}: {
		disabled?: boolean;
		defaultValue?: string | null;
		defaultOpen?: boolean;
		value?: string | null | undefined;
		onValueChange?: (value: string | null | string[], event: Event) => void;
		onOpenChange?: (open: boolean, eventDetails: unknown) => void;
	} = $props();
</script>

<Select.Root {disabled} {defaultValue} {defaultOpen} {value} {onValueChange} {onOpenChange}>
	<Select.Label data-testid="label">Fruit</Select.Label>
	<Select.Trigger data-testid="trigger">
		<Select.Value data-testid="value" placeholder="Pick a fruit" />
		<Select.Icon data-testid="icon" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Backdrop data-testid="backdrop" />
		<Select.Positioner>
			<Select.Popup data-testid="popup">
				<Select.ScrollUpArrow data-testid="scroll-up" />
				<Select.Arrow data-testid="arrow" />
				<Select.List data-testid="list">
					<Select.Group data-testid="group">
						<Select.GroupLabel data-testid="group-label">Citrus</Select.GroupLabel>
						<Select.Item data-testid="item-apple" value="apple">
							<Select.ItemText>Apple</Select.ItemText>
							<Select.ItemIndicator data-testid="indicator-apple" />
						</Select.Item>
						<Select.Item data-testid="item-banana" value="banana">
							<Select.ItemText>Banana</Select.ItemText>
							<Select.ItemIndicator data-testid="indicator-banana" />
						</Select.Item>
					</Select.Group>
					<Select.Separator data-testid="separator" />
					<Select.Item data-testid="item-cherry" value="cherry">
						<Select.ItemText>Cherry</Select.ItemText>
						<Select.ItemIndicator data-testid="indicator-cherry" />
					</Select.Item>
				</Select.List>
				<Select.ScrollDownArrow data-testid="scroll-down" />
			</Select.Popup>
		</Select.Positioner>
	</Select.Portal>
</Select.Root>
