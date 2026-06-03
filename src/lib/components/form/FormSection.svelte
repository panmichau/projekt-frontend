<script lang="ts">
	type Props = {
		title: string;
		description?: string;
		children: import('svelte').Snippet;
	};

	let { title, description, children }: Props = $props();
</script>

<section class="mb-6 border border-zinc-300 bg-white p-5">
	<div class="mb-4 border-b border-zinc-200 pb-4">
		<h2 class="text-base font-semibold text-black">
			{title}
		</h2>

		{#if description}
			<p class="text-sm text-zinc-600">
				{description}
			</p>
		{/if}
	</div>

	{@render children()}
</section>