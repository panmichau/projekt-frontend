<script lang="ts">
	type Props = {
		item: unknown;
		canDelete?: boolean;
		onEdit?: (item: unknown) => void;
		onDelete?: (item: unknown) => void;
		onView?: (item: unknown) => void;
	};

	let {
		item,
		canDelete = true,
		onEdit,
		onDelete,
		onView
	}: Props = $props();
</script>

<div class="flex justify-end gap-3">
	{#if onView}
		<button
			type="button"
			class="text-sm font-medium text-blue-700 hover:text-blue-900"
			onclick={() => onView(item)}
		>
			Zobacz
		</button>
	{/if}

	{#if onEdit}
		<button
			type="button"
			class="text-sm font-medium text-black hover:text-zinc-700"
			onclick={() => onEdit(item)}
		>
			Edytuj
		</button>
	{/if}

	{#if onDelete && canDelete}
		<button
			type="button"
			class="text-sm font-medium text-red-700 hover:text-red-900"
			onclick={() => onDelete(item)}
		>
			Usuń
		</button>
	{/if}
</div>