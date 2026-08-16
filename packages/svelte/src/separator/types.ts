import type { HTMLAttributes } from 'svelte/elements';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	orientation?: SeparatorOrientation;
};
