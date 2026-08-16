<script lang="ts">
	import { Toast, createToastManager } from 'base-ui-svelte/toast';

	const toaster = createToastManager();
</script>

<h1>Toast</h1>

<section class="demo">
	<Toast.Provider {toaster}>
		<button
			class="btn"
			onclick={() =>
				toaster.add({ title: 'Saved', description: 'Your changes were stored.', timeout: 3000 })}
		>
			Show toast
		</button>
		<Toast.Portal>
			<Toast.Viewport class="toast-viewport">
				{#each toaster.toasts as toast (toast.id)}
					<Toast.Root class="toast" {toast}>
						<Toast.Content>
							<Toast.Title class="toast-title">{toast.title}</Toast.Title>
							{#if toast.description}
								<Toast.Description class="toast-description">{toast.description}</Toast.Description>
							{/if}
							<Toast.Close class="btn">Dismiss</Toast.Close>
						</Toast.Content>
					</Toast.Root>
				{/each}
			</Toast.Viewport>
		</Toast.Portal>
	</Toast.Provider>
</section>
