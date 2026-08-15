import { sequence } from '@sveltejs/kit/hooks';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(async ({ event, resolve }) => {
	return resolve(event);
});
