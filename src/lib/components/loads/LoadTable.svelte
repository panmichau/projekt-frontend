<script lang="ts">
	import type { LoadSummaryDTO } from '$lib/api/types';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableActions from '$lib/components/table/TableActions.svelte';

	type Props = {
		loads: LoadSummaryDTO[];
		onEdit: (load: LoadSummaryDTO) => void;
		onDelete: (load: LoadSummaryDTO) => void;
	};

	let { loads, onEdit, onDelete }: Props = $props();
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Identyfikator</TableHeaderCell>
			<TableHeaderCell>Kontrakt</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each loads as load, index (load.id ?? index)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{load.id}
				</TableCell>

				<TableCell strong>
					{load.identifier ?? '-'}
				</TableCell>

				<TableCell>
					{load.contract?.name ?? 'Brak'}
				</TableCell>
				<TableCell align="right">
                <TableActions 
                    item={load} 
                    onEdit={(item) => onEdit(item as LoadSummaryDTO)} 
                    onDelete={(item) => onDelete(item as LoadSummaryDTO)} 
                />
                </TableCell>
			</tr>
		{/each}
	</tbody>
</TableWrapper>