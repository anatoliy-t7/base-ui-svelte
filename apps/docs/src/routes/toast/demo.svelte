<script lang="ts">
	import { Toast, createToastManager } from 'base-ui-svelte/toast';

	const toaster = createToastManager({ timeout: 10000 });
	let count = $state(0);

	function createToast(): void {
		count += 1;
		toaster.add({
			title: `Toast ${count} created`,
			description: 'This is a toast notification.'
		});
	}

	function createPromiseToast(): void {
		void toaster.promise(
			new Promise<string>((resolve) => {
				window.setTimeout(() => resolve('done'), 1500);
			}),
			{
				loading: 'Saving…',
				success: 'Saved',
				error: 'Failed to save'
			}
		);
	}
</script>

<Toast.Provider {toaster}>
	<div class="row">
		<button class="btn" type="button" onclick={createToast}>Create toast</button>
		<button class="btn btn-secondary" type="button" onclick={createPromiseToast}>
			Promise toast
		</button>
	</div>
	<Toast.Portal>
		<Toast.Viewport class="toast-viewport">
			{#each toaster.toasts as toast (toast.id)}
				<Toast.Root class="toast" {toast}>
					<Toast.Content class="toast-content">
						<div class="min-w-0 flex-1">
							<Toast.Title class="toast-title" />
							<Toast.Description class="toast-description" />
						</div>
						<Toast.Close class="toast-close">Dismiss</Toast.Close>
					</Toast.Content>
				</Toast.Root>
			{/each}
		</Toast.Viewport>
	</Toast.Portal>
</Toast.Provider>
