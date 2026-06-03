<script lang="ts">
	type Props = {
		item: unknown;
		canDelete?: boolean;
		onEdit: (item: unknown) => void;
		onDelete: (item: unknown) => void;
	};

	let {
		item,
		canDelete = true,
		onEdit,
		onDelete
	}: Props = $props();
</script>

<div class="flex justify-end gap-3">
	<button
		class="text-sm font-medium text-black hover:text-zinc-700"
		onclick={() => onEdit(item)}
	>
		Edytuj
	</button>

	{#if canDelete}
		<button
			class="text-sm font-medium text-red-700 hover:text-red-900"
			onclick={() => onDelete(item)}
		>
			Usuń
		</button>
	{:else}
		<span class="text-sm text-zinc-500">Brak ID</span>
	{/if}
</div>