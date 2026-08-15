<script lang="ts">
	import { Dialog } from 'base-ui-svelte/dialog';
	import '../demo.css';
</script>

<h1>Dialog</h1>
<div class="demo">
	<Dialog.Root>
		<Dialog.Trigger class="btn">Open dialog</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Backdrop class="backdrop" />
			<Dialog.Popup class="popup" style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1;">
				<Dialog.Title>Confirm</Dialog.Title>
				<Dialog.Description>This is a modal dialog demo.</Dialog.Description>
				<Dialog.Close class="btn">Close</Dialog.Close>
			</Dialog.Popup>
		</Dialog.Portal>
	</Dialog.Root>
</div>
