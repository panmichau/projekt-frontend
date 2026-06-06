<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		value,
		children
	}: {
		label: string;
		value?: string | number | null;
		children?: Snippet;
	} = $props();
</script>

<div class="flex flex-col">
	<dt class="text-sm font-medium text-zinc-500">{label}</dt>
	<dd class="mt-1 text-sm font-semibold text-zinc-900">
		{#if children}
			{@render children()}
		{:else}
			{value !== undefined && value !== null && value !== '' ? value : '-'}
		{/if}
	</dd>
</div>
