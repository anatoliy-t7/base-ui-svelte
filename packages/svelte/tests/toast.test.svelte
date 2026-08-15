<script lang="ts">
	import { Toast, createToastManager } from '../src/toast/index.js';

	const toaster = createToastManager();

	function addToast(): void {
		toaster.add({
			title: 'Saved',
			description: 'Your changes were saved.',
			timeout: 5000,
			actionProps: {
				children: 'Undo',
				onclick: () => {
					toaster.close(toaster.toasts[0]?.id ?? '');
				}
			}
		});
	}
</script>

<Toast.Provider {toaster}>
	<button type="button" data-testid="trigger" onclick={addToast}>Notify</button>
	<Toast.Portal>
		<Toast.Viewport data-testid="viewport">
			{#each toaster.toasts as toast (toast.id)}
				<Toast.Root {toast} data-testid="toast">
					<Toast.Content data-testid="content">
						<Toast.Title data-testid="title" />
						<Toast.Description data-testid="description" />
						<Toast.Action data-testid="action" />
						<Toast.Close data-testid="close" />
					</Toast.Content>
				</Toast.Root>
			{/each}
		</Toast.Viewport>
	</Toast.Portal>
</Toast.Provider>
