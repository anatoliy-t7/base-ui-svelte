import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DialogHandleTest from './dialog-handle.test.svelte';

describe('Dialog createHandle', () => {
	it('opens and closes from an outside button via createHandle', async () => {
		const user = userEvent.setup();
		render(DialogHandleTest);

		expect(screen.queryByTestId('popup')).toBeNull();

		await user.click(screen.getByTestId('outside-open'));
		expect(screen.getByTestId('popup')).toBeInTheDocument();
		expect(screen.getByTestId('viewport')).toBeInTheDocument();

		await user.click(screen.getByTestId('outside-close'));
		await waitFor(() => {
			expect(screen.queryByTestId('popup')).toBeNull();
		});
	});
});
