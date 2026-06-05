<script lang="ts">
	import type { Snippet } from 'svelte';

	let { 
		title, 
		description, 
		onClose, 
		children 
	}: {
		title: string;
		description?: string;
		onClose: () => void;
		children: Snippet;
	} = $props();
</script>

<div class="mb-6 rounded border border-zinc-200 bg-white p-6 shadow-sm">
	<div class="mb-6 flex items-start justify-between border-b border-zinc-100 pb-4">
		<div>
			<h2 class="text-xl font-semibold text-zinc-900">{title}</h2>
			{#if description}
				<p class="mt-1 text-sm text-zinc-500">{description}</p>
			{/if}
		</div>
		<button
			type="button"
			class="text-zinc-400 hover:text-zinc-600 focus:outline-none"
			onclick={onClose}
			title="Zamknij detale"
		>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
	
	<dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{@render children()}
	</dl>

	<div class="mt-8 border-t border-zinc-100 pt-5">
		<button
			type="button"
			class="inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
			onclick={onClose}
		>
			Wróć do listy
		</button>
	</div>
</div>