<script lang="ts">
	let {
		align = 'left',
		children
	}: {
		align?: 'left' | 'right';
		children: import('svelte').Snippet;
	} = $props();
</script>

<th
	class={`border-b border-zinc-300 px-4 py-3 text-${align} text-xs font-semibold tracking-wide text-zinc-700 uppercase`}
>
	{@render children()}
</th>
