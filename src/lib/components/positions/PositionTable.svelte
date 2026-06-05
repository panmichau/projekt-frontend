<script lang="ts">
	import type { PositionDTO } from '$lib/api/types';
	import TableActions from '$lib/components/table/TableActions.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';


	type Props = {
		positions: PositionDTO[];
		onDelete: (position: PositionDTO) => void;
	};

	let { positions, onDelete }: Props = $props();
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Stanowisko</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each positions as item, index (item.id ?? index)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{item.id ?? '-'}
				</TableCell>

				<TableCell strong>
					{item.position ?? '-'}
				</TableCell>

				<TableCell align="right">
					<TableActions
						item={item}
						canDelete={item.id !== undefined && item.id !== null}
						onDelete={() => onDelete(item)}
					/>
				</TableCell>
			</tr>
		{:else}
			<tr>
				<td colspan="3" class="p-8 text-center text-sm italic text-zinc-400">
					Brak stanowisk na liście.
				</td>
			</tr>
		{/each}
	</tbody>
</TableWrapper>
