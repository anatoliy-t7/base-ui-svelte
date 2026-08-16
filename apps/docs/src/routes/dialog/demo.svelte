<script lang="ts">
	import { Dialog } from 'base-ui-svelte/dialog';
</script>

<h2>Sizes</h2>
<div class="row">
	<Dialog.Root>
		<Dialog.Trigger class="btn">Open sm</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Backdrop class="dialog-backdrop" />
			<Dialog.Viewport>
				<Dialog.Popup class="dialog-popup dialog-popup-sm">
					<Dialog.Title class="dialog-title">Small</Dialog.Title>
					<Dialog.Description class="dialog-description">dialog-popup-sm</Dialog.Description>
					<div class="dialog-footer">
						<Dialog.Close class="btn">Close</Dialog.Close>
					</div>
				</Dialog.Popup>
			</Dialog.Viewport>
		</Dialog.Portal>
	</Dialog.Root>
	<Dialog.Root>
		<Dialog.Trigger class="btn">Open md</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Backdrop class="dialog-backdrop" />
			<Dialog.Viewport>
				<Dialog.Popup class="dialog-popup dialog-popup-md">
					<Dialog.Title class="dialog-title">Medium</Dialog.Title>
					<Dialog.Description class="dialog-description">dialog-popup-md</Dialog.Description>
					<div class="dialog-footer">
						<Dialog.Close class="btn">Close</Dialog.Close>
					</div>
				</Dialog.Popup>
			</Dialog.Viewport>
		</Dialog.Portal>
	</Dialog.Root>
	<Dialog.Root>
		<Dialog.Trigger class="btn">Open lg</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Backdrop class="dialog-backdrop" />
			<Dialog.Viewport>
				<Dialog.Popup class="dialog-popup dialog-popup-lg">
					<Dialog.Title class="dialog-title">Large</Dialog.Title>
					<Dialog.Description class="dialog-description">dialog-popup-lg</Dialog.Description>
					<div class="dialog-footer">
						<Dialog.Close class="btn">Close</Dialog.Close>
					</div>
				</Dialog.Popup>
			</Dialog.Viewport>
		</Dialog.Portal>
	</Dialog.Root>
</div>
