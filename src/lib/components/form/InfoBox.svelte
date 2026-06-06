<script lang="ts">
	type Props = {
		title?: string;
		text: string;
	};

	let { title, text }: Props = $props();
</script>

<div class="border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:col-span-2">
	{#if title}
		<p class="font-medium text-zinc-700">{title}</p>
	{/if}

	<p class={title ? 'mt-1 text-xs' : ''}>{text}</p>
</div>
