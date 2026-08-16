import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import SliderTest from './slider.test.svelte';

describe('Slider', () => {
	it('exposes slider semantics and formatted value', () => {
		render(SliderTest);

		const thumb = screen.getByTestId('thumb');
		expect(thumb).toHaveAttribute('role', 'slider');
		expect(thumb).toHaveAttribute('aria-valuemin', '0');
		expect(thumb).toHaveAttribute('aria-valuemax', '100');
		expect(thumb).toHaveAttribute('aria-valuenow', '40');
		expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');

		const label = screen.getByTestId('label');
		expect(thumb).toHaveAttribute('aria-labelledby', label.id);

		expect(screen.getByTestId('value')).toHaveTextContent('40');
		expect(screen.getByTestId('indicator')).toHaveStyle({
			left: '0%',
			width: '40%',
			height: '100%',
		});
	});

	it('adjusts value with arrow keys', async () => {
		const user = userEvent.setup();
		render(SliderTest);

		const thumb = screen.getByTestId('thumb');
		thumb.focus();
		await user.keyboard('{ArrowRight}');
		expect(thumb).toHaveAttribute('aria-valuenow', '41');
		await user.keyboard('{Home}');
		expect(thumb).toHaveAttribute('aria-valuenow', '0');
		await user.keyboard('{End}');
		expect(thumb).toHaveAttribute('aria-valuenow', '100');
	});

	it('supports range values with two thumbs and an indicator between them', () => {
		render(SliderTest, { props: { value: [20, 60] } });

		const thumb0 = screen.getByTestId('thumb-0');
		const thumb1 = screen.getByTestId('thumb-1');
		expect(thumb0).toHaveAttribute('aria-valuenow', '20');
		expect(thumb0).toHaveAttribute('data-index', '0');
		expect(thumb1).toHaveAttribute('aria-valuenow', '60');
		expect(thumb1).toHaveAttribute('data-index', '1');

		expect(screen.getByTestId('value')).toHaveTextContent('20 – 60');
		expect(screen.getByTestId('indicator')).toHaveStyle({
			left: '20%',
			width: '40%',
			height: '100%',
		});
		expect(screen.getByTestId('slider')).toHaveAttribute('role', 'group');
	});

	it('moves the focused range thumb with arrow keys without crossing', async () => {
		const user = userEvent.setup();
		render(SliderTest, { props: { value: [20, 60] } });

		const thumb0 = screen.getByTestId('thumb-0');
		const thumb1 = screen.getByTestId('thumb-1');

		thumb0.focus();
		await user.keyboard('{ArrowRight}');
		expect(thumb0).toHaveAttribute('aria-valuenow', '21');

		thumb1.focus();
		await user.keyboard('{ArrowLeft}');
		expect(thumb1).toHaveAttribute('aria-valuenow', '59');

		thumb0.focus();
		await user.keyboard('{End}');
		expect(thumb0).toHaveAttribute('aria-valuenow', '59');
	});

	it('flips horizontal arrow keys under DirectionProvider rtl', async () => {
		const user = userEvent.setup();
		render(SliderTest, {
			props: { value: 40, direction: 'rtl', withProvider: true },
		});

		const thumb = screen.getByTestId('thumb');
		expect(screen.getByTestId('slider')).toHaveAttribute('dir', 'rtl');
		thumb.focus();
		await user.keyboard('{ArrowLeft}');
		expect(thumb).toHaveAttribute('aria-valuenow', '41');
		await user.keyboard('{ArrowRight}');
		expect(thumb).toHaveAttribute('aria-valuenow', '40');
	});

	it('has no axe violations', async () => {
		const { container } = render(SliderTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it('has no axe violations for range', async () => {
		const { container } = render(SliderTest, { props: { value: [20, 60] } });
		expect(await axe(container)).toHaveNoViolations();
	});
});
