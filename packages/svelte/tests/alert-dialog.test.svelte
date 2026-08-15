<script lang="ts">
	import { AlertDialog } from '../src/alert-dialog/index.js';
</script>

<AlertDialog.Root data-testid="alert-dialog-root">
	<AlertDialog.Trigger data-testid="trigger">Open</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Backdrop data-testid="backdrop" />
		<AlertDialog.Viewport data-testid="viewport">
			<AlertDialog.Popup data-testid="popup">
				<AlertDialog.Title>Title</AlertDialog.Title>
				<AlertDialog.Description>Description</AlertDialog.Description>
				<AlertDialog.Close data-testid="close">Close</AlertDialog.Close>
			</AlertDialog.Popup>
		</AlertDialog.Viewport>
	</AlertDialog.Portal>
</AlertDialog.Root>
