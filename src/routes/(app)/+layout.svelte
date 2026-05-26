<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import { auth } from '$lib/auth/auth.svelte';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { appModules } from '$lib/navigation/app-modules';

	let { children } = $props();

	let ready = $state(false);
	let allowed = $state(false);

	function getModuleForPath(pathname: string) {
		return appModules
			.slice()
			.sort((a, b) => b.href.length - a.href.length)
			.find((module) => pathname === module.href || pathname.startsWith(`${module.href}/`));
	}

	function canAccessPath(pathname: string) {
		const module = getModuleForPath(pathname);
		if (!module) {
			return true;
		}

		return auth.hasAnyRole(module.roles);
	}

	async function checkAccess() {
		if (!auth.isLoggedIn) {
			allowed = false;
			await goto(resolve('/login'));
			return;
		}

		if (!canAccessPath(page.url.pathname)) {
			allowed = false;
			await goto(resolve('/dashboard'));
			return;
		}

		allowed = true;
	}

	onMount(async () => {
		await auth.init();
		ready = true;
		await checkAccess();
	});

	$effect(() => {
		if (!ready) return;

		checkAccess();
	});
</script>

{#if !ready || (auth.loading && !auth.initialized)}
	<div class="flex min-h-screen items-center justify-center bg-white text-black">
		<p class="text-sm text-zinc-600">Ładowanie...</p>
	</div>
{:else if auth.isLoggedIn && allowed}
	<AppShell>
		{@render children()}
	</AppShell>
{/if}