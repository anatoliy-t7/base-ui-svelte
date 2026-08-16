import { describe, expect, it } from 'vitest';
import { createToastManager } from '../src/toast/manager.svelte.js';

describe('ToastManager.promise', () => {
	it('shows loading then success', async () => {
		const manager = createToastManager({ timeout: 5000 });

		const result = await manager.promise(Promise.resolve(42), {
			loading: 'Loading',
			success: (value) => `Got ${value}`,
			error: 'Failed',
		});

		expect(result).toBe(42);
		expect(manager.toasts).toHaveLength(1);
		expect(manager.toasts[0]?.title).toBe('Got 42');
		expect(manager.toasts[0]?.type).toBe('success');
	});

	it('shows error and rethrows', async () => {
		const manager = createToastManager({ timeout: 5000 });

		await expect(
			manager.promise(Promise.reject(new Error('boom')), {
				loading: 'Loading',
				success: 'Ok',
				error: (error) => (error instanceof Error ? error.message : 'Failed'),
			}),
		).rejects.toThrow('boom');

		expect(manager.toasts).toHaveLength(1);
		expect(manager.toasts[0]?.title).toBe('boom');
		expect(manager.toasts[0]?.type).toBe('error');
	});
});
