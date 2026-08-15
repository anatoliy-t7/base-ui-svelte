import type { HTMLAttributes } from 'svelte/elements';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
	orientation?: SeparatorOrientation;
};
