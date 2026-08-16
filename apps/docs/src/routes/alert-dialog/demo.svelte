<script lang="ts">
	import { AlertDialog } from 'base-ui-svelte/alert-dialog';
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class="btn">Discard draft</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Backdrop class="alert-dialog-backdrop" />
		<AlertDialog.Viewport>
			<AlertDialog.Popup class="alert-dialog-popup">
				<AlertDialog.Title class="alert-dialog-title">Discard draft?</AlertDialog.Title>
				<AlertDialog.Description class="alert-dialog-description">
					This action cannot be undone. Your draft will be permanently deleted.
				</AlertDialog.Description>
				<div class="alert-dialog-footer">
					<AlertDialog.Close class="btn">Cancel</AlertDialog.Close>
					<AlertDialog.Close class="btn">Discard</AlertDialog.Close>
				</div>
			</AlertDialog.Popup>
		</AlertDialog.Viewport>
	</AlertDialog.Portal>
</AlertDialog.Root>
