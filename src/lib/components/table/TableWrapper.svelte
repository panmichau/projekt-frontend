<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="overflow-hidden border border-zinc-300 bg-white">
	<table class="min-w-full border-collapse">
		{@render children()}
	</table>
</div>