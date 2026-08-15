<script lang="ts">
	import { Dialog } from '../src/index.js';
</script>

<Dialog.Root data-testid="dialog-root">
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
