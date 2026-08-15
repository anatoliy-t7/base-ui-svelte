<script lang="ts">
	import { AlertDialog } from 'base-ui-svelte/alert-dialog';
	import '../demo.css';
</script>

<h1>Alert Dialog</h1>
<div class="demo">
	<AlertDialog.Root>
		<AlertDialog.Trigger class="btn">Discard draft</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Backdrop class="backdrop" />
			<AlertDialog.Viewport>
				<AlertDialog.Popup
					class="popup"
					style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1;"
				>
					<AlertDialog.Title>Discard draft?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. Your draft will be permanently deleted.
					</AlertDialog.Description>
					<div class="sep-row">
						<AlertDialog.Close class="btn">Cancel</AlertDialog.Close>
						<AlertDialog.Close class="btn">Discard</AlertDialog.Close>
					</div>
				</AlertDialog.Popup>
			</AlertDialog.Viewport>
		</AlertDialog.Portal>
	</AlertDialog.Root>
</div>
