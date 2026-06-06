<script lang="ts">
	type Props = {
		error?: string | null;
	};

	let { error = null }: Props = $props();
</script>

{#if error}
	<p class="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
		{error}
	</p>
{/if}
