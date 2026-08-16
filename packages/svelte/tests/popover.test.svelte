<script lang="ts">
	import { Popover } from '../src/index.js';

	let {
		modal = false as boolean | 'trap-focus',
		defaultOpen = false,
		open = undefined as boolean | undefined,
		onOpenChange,
	}: {
		modal?: boolean | 'trap-focus';
		defaultOpen?: boolean;
		open?: boolean | undefined;
		onOpenChange?: (open: boolean, eventDetails: unknown) => void;
	} = $props();
</script>

<Popover.Root {modal} {defaultOpen} {open} {onOpenChange}>
	<Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
	<Popover.Portal>
		<Popover.Backdrop data-testid="backdrop" />
		<Popover.Viewport data-testid="viewport">
			<Popover.Positioner>
				<Popover.Popup data-testid="popup">
					<Popover.Title>Title</Popover.Title>
					<Popover.Description>Description</Popover.Description>
					<Popover.Close data-testid="close">Close</Popover.Close>
				</Popover.Popup>
			</Popover.Positioner>
		</Popover.Viewport>
	</Popover.Portal>
</Popover.Root>
