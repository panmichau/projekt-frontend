<script lang="ts">
	let {
		align = 'left',
		strong = false,
		nowrap = false,
		children
	}: {
		align?: 'left' | 'right';
		strong?: boolean;
		nowrap?: boolean;
		children: import('svelte').Snippet;
	} = $props();
</script>

<td
	class={[
		'px-4 py-3 text-sm',
		align === 'right' ? 'text-right' : '',
		strong ? 'font-medium text-black' : 'text-zinc-700',
		nowrap ? 'whitespace-nowrap' : ''
	].join(' ')}
>
	{@render children()}
</td>