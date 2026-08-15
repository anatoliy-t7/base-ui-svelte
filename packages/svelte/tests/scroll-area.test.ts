import { render, screen } from '@testing-library/svelte';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import ScrollAreaTest from './scroll-area.test.svelte';

describe('ScrollArea', () => {
	it('renders viewport, scrollbar, thumb, and corner', () => {
		render(ScrollAreaTest);

		expect(screen.getByTestId('root')).toBeInTheDocument();
		expect(screen.getByTestId('viewport')).toBeInTheDocument();
		expect(screen.getByTestId('content')).toHaveTextContent('Long content for scrolling');
		expect(screen.getByTestId('scrollbar')).toHaveAttribute('data-orientation', 'vertical');
		expect(screen.getByTestId('thumb')).toHaveAttribute('data-slot', 'scroll-area-thumb');
		expect(screen.getByTestId('corner')).toBeInTheDocument();
	});

	it('has no axe violations', async () => {
		const { container } = render(ScrollAreaTest);
		expect(await axe(container)).toHaveNoViolations();
	});
});
