<script lang="ts">
	import { Dialog, createHandle } from '../src/dialog/index.js';

	const handle = createHandle();
</script>

<button type="button" data-testid="outside-open" onclick={() => handle.open()}>Open outside</button>
<button type="button" data-testid="outside-close" onclick={() => handle.close()}
	>Close outside</button
>

<Dialog.Root data-testid="dialog-root" {handle}>
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
