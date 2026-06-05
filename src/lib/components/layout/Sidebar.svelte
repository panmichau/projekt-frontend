<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import { auth } from '$lib/auth/auth.svelte';
	import { appModules } from '$lib/navigation/app-modules';
	import { goto } from '$app/navigation';
	import Weather from '../ui/Weather.svelte';
	import Button from '../ui/Button.svelte';

	const visibleModules = $derived(appModules.filter((module) => auth.hasAnyRole(module.roles)));

	const pathname = $derived(page.url.pathname);

	let errorButton = $state(false);
	let emailButton = $state(false);

	function toggleErrorButton() {
		errorButton = !errorButton;
	}

	function toggleEmailButton() {
		emailButton = !emailButton;
	}

	onMount(() => {
		window.toggleErrorButton = toggleErrorButton;
		window.toggleEmailButton = toggleEmailButton;
		return () => {
			delete window.toggleErrorButton;
		};
	});
</script>

<aside class="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-300 bg-white md:block">
	<div class="flex h-full flex-col">
		<div class="flex flex-col gap-3 border-b border-zinc-300 p-5">
			<div>
				<a href={resolve('/dashboard')} class="text-lg font-semibold tracking-tight"> Panel </a>
				{#if auth.user}
					<p class="mt-2 truncate text-sm text-zinc-600">
						{auth.user.email}
					</p>
				{/if}
			</div>

			<Weather />

			{#if errorButton}
				<Button
					type="button"
					fullWidth
					variant="primary"
					onclick={() => {
						throw new Error('Test error');
					}}>Test error</Button
				>
			{/if}
			{#if emailButton}
				<Button
					type="button"
					fullWidth
					variant="primary"
					onclick={() => {
						if (auth.user != null) auth.user.email = 'zmieniony@email.com';
					}}>Zmień email</Button
				>
			{/if}
		</div>

		<nav class="flex-1 space-y-1 p-3">
			<a
				href={resolve('/dashboard')}
				class={`block border px-3 py-2 text-sm font-medium ${
					pathname === '/app/dashboard'
						? 'border-black bg-black text-white'
						: 'border-transparent text-black hover:border-zinc-300 hover:bg-zinc-100'
				}`}
			>
				Dashboard
			</a>

			{#each visibleModules as module (module.href)}
				<a
					href={resolve(module.href as '/')}
					class={`block border px-3 py-2 text-sm font-medium ${
						pathname === module.href
							? 'border-black bg-black text-white'
							: 'border-transparent text-black hover:border-zinc-300 hover:bg-zinc-100'
					}`}
				>
					{module.title}
				</a>
			{/each}
		</nav>

		<div class="border-t border-zinc-300 p-3">
			<div class="mb-3 flex flex-wrap gap-1.5">
				{#each auth.roles as role (role)}
					<span class="border border-zinc-300 px-2 py-0.5 text-xs font-medium">
						{role}
					</span>
				{/each}
			</div>

			<button
				class="w-full border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100"
				onclick={() => {
					auth.logout();
					goto(resolve('/login'));
				}}
			>
				Wyloguj
			</button>
		</div>
	</div>
</aside>
