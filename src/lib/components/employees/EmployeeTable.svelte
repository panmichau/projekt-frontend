<script lang="ts">
	import type { EmployeeSummaryDTO } from '$lib/api/types';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableActions from '$lib/components/table/TableActions.svelte';

	type Props = {
		employees: EmployeeSummaryDTO[];
		onEdit: (employee: EmployeeSummaryDTO) => void;
		onDelete: (employee: EmployeeSummaryDTO) => void;
		onView?: (employee: EmployeeSummaryDTO) => void;
	};

	let { employees, onEdit, onDelete, onView }: Props = $props();
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Imię</TableHeaderCell>
			<TableHeaderCell>Nazwisko</TableHeaderCell>
			<TableHeaderCell>Stanowisko</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each employees as employee, index (employee.id ?? index)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{employee.id}
				</TableCell>

				<TableCell strong>
					{employee.firstName ?? '-'}
				</TableCell>

				<TableCell>
					{employee.lastName ?? '-'}
				</TableCell>

				<TableCell>
					{employee.position ?? '-'}
				</TableCell>

				<TableCell align="right">
					<TableActions
						item={employee}
						canDelete={Boolean(employee.id)}
						onEdit={() => onEdit(employee)}
						onDelete={() => onDelete(employee)}
						onView={() => onView?.(employee)}
					/>
				</TableCell>
			</tr>
		{/each}
	</tbody>
</TableWrapper>