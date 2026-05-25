import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/auth/auth.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    await auth.init();

    if (!auth.isLoggedIn) {
        throw redirect(302, '/login');
    }

    if (!auth.hasAnyRole(['ADMIN', 'MANAGER'])) {
        throw redirect(302, '/dashboard');
    }

    return {};
};