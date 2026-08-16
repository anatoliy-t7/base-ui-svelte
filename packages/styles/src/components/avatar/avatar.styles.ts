import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const avatarVariants = tv({
	slots: {
		root: 'avatar',
		fallback: 'avatar-fallback',
		image: '',
	},
	variants: {
		size: {
			sm: {
				root: 'avatar-sm',
			},
			md: {
				root: 'avatar-md',
			},
			lg: {
				root: 'avatar-lg',
			},
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;
