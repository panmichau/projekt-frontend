<script lang="ts">
	import { auth } from '$lib/auth/auth.svelte';
	import { appModules } from '$lib/navigation/app-modules';
	import DashboardCard from '$lib/components/dashboard/DashboardCard.svelte';

	const visibleModules = $derived(appModules.filter((module) => auth.hasAnyRole(module.roles)));
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
	<header class="mb-8 border-b border-zinc-200 pb-6">
		<h1 class="text-2xl font-semibold tracking-tight text-black">Dashboard</h1>

		<p class="mt-1 text-sm text-zinc-600">Wybierz moduł, w którym chcesz pracować.</p>
	</header>

	<section>
		<div class="mb-4">
			<h2 class="text-lg font-semibold text-black">Dostępne moduły</h2>

			<p class="mt-1 text-sm text-zinc-600">Widoczne moduły zależą od Twojej roli w systemie.</p>
		</div>

		{#if visibleModules.length > 0}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each visibleModules as module (module.href)}
					<DashboardCard title={module.title} description={module.description} href={module.href} />
				{/each}
			</div>
		{:else}
			<div class="border border-dashed border-zinc-300 bg-white p-8 text-center">
				<p class="text-sm text-zinc-600">Brak dostępnych modułów dla tej roli.</p>
			</div>
		{/if}
	</section>
</div>
