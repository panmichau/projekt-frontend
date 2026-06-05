<script lang="ts">
	import type { ContractSummaryDTO } from '$lib/api/types';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableActions from '$lib/components/table/TableActions.svelte';
	

	type Props = {
		contracts: ContractSummaryDTO[];
		onEdit: (contract: ContractSummaryDTO) => void;
		onDelete: (contract: ContractSummaryDTO) => void;
		onView?: (contract: ContractSummaryDTO) => void;
	};

	let { contracts, onEdit, onDelete, onView }: Props = $props();
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Nazwa</TableHeaderCell>
			<TableHeaderCell>Klient</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each contracts as contract (contract.id)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell>
					{contract.id}
				</TableCell>

				<TableCell strong>
					{contract.name}
				</TableCell>

				<TableCell>
					{contract.clientName ?? '—'}
				</TableCell>

				<TableCell align="right">
					<TableActions
						item={contract}
						canDelete={Boolean(contract.id)}
						onEdit={() => onEdit(contract)}
						onDelete={() => onDelete(contract)}
						onView={() => onView?.(contract)}
					/>
				</TableCell>
			</tr>
		{/each}
	</tbody>
</TableWrapper>