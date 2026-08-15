import { render, screen, waitFor } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import AvatarTest from './avatar.test.svelte';

describe('Avatar', () => {
	it('shows fallback while image is not loaded and hides image until loaded', async () => {
		render(AvatarTest);

		const image = screen.getByTestId('image');
		expect(image).toHaveAttribute('hidden');

		expect(screen.queryByTestId('fallback')).toBeNull();

		image.dispatchEvent(new Event('error'));
		await waitFor(() => {
			expect(screen.getByTestId('fallback')).toHaveTextContent('AD');
		});
	});

	it('has no axe violations', async () => {
		const { container } = render(AvatarTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
