<script lang="ts">
	import { Dialog } from '../src/index.js';

	let {
		modal = true as boolean | 'trap-focus',
		disablePointerDismissal = false,
	}: {
		modal?: boolean | 'trap-focus';
		disablePointerDismissal?: boolean;
	} = $props();
</script>

<Dialog.Root data-testid="dialog-root" {modal} {disablePointerDismissal}>
	<Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Backdrop data-testid="backdrop" />
		<Dialog.Viewport data-testid="viewport">
			<Dialog.Popup data-testid="popup">
				<Dialog.Title>Title</Dialog.Title>
				<Dialog.Description>Description</Dialog.Description>
				<Dialog.Close data-testid="close">Close</Dialog.Close>
			</Dialog.Popup>
		</Dialog.Viewport>
	</Dialog.Portal>
</Dialog.Root>
