<script lang="ts">
	import type { ClientSummaryDTO } from '$lib/api/types';
	import TableActions from '$lib/components/table/TableActions.svelte';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';

	type Props = {
		clients: ClientSummaryDTO[];
		onEdit: (client: ClientSummaryDTO) => void;
		onDelete: (client: ClientSummaryDTO) => void;
		onView?: (client: ClientSummaryDTO) => void;
		editRoles?: string[];
	};

	let { clients, onEdit, onDelete, onView, editRoles }: Props = $props();
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Nazwa</TableHeaderCell>
			<TableHeaderCell>NIP</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each clients as client, index (client.id ?? index)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{client.id}
				</TableCell>

				<TableCell strong>
					{client.name ?? '-'}
				</TableCell>

				<TableCell>
					{client.nip ?? '-'}
				</TableCell>

				<TableCell align="right">
					<TableActions
						item={client}
						canDelete={Boolean(client.id)}
						onEdit={() => onEdit(client)}
						onDelete={() => onDelete(client)}
						onView={() => onView?.(client)}
						{editRoles}
					/>
				</TableCell>
			</tr>
		{/each}
	</tbody>
</TableWrapper>
