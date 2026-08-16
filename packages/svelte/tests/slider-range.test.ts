import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import SliderRangeTest from './slider-range.test.svelte';

describe('Slider range', () => {
	it('renders two thumbs and spans the indicator between them', () => {
		render(SliderRangeTest);

		const minThumb = screen.getByTestId('thumb-min');
		const maxThumb = screen.getByTestId('thumb-max');
		expect(minThumb).toHaveAttribute('aria-valuenow', '20');
		expect(maxThumb).toHaveAttribute('aria-valuenow', '60');
		expect(screen.getByTestId('value')).toHaveTextContent('20 – 60');
		expect(screen.getByTestId('indicator')).toHaveStyle({
			left: '20%',
			width: '40%',
			height: '100%',
		});
	});

	it('updates the focused thumb with keyboard', async () => {
		const user = userEvent.setup();
		render(SliderRangeTest);

		const minThumb = screen.getByTestId('thumb-min');
		const maxThumb = screen.getByTestId('thumb-max');

		minThumb.focus();
		await user.keyboard('{ArrowRight}');
		expect(minThumb).toHaveAttribute('aria-valuenow', '21');
		expect(maxThumb).toHaveAttribute('aria-valuenow', '60');

		maxThumb.focus();
		await user.keyboard('{ArrowLeft}');
		expect(maxThumb).toHaveAttribute('aria-valuenow', '59');
		expect(minThumb).toHaveAttribute('aria-valuenow', '21');
	});

	it('has no axe violations', async () => {
		const { container } = render(SliderRangeTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
