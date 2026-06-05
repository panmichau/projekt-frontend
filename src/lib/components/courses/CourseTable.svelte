<script lang="ts">
	import type { CourseSummaryDTO } from '$lib/api/types';

	import TableActions from '$lib/components/table/TableActions.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';

	type Props = {
		courses: CourseSummaryDTO[];
		onEdit: (course: CourseSummaryDTO) => void;
		onDelete: (course: CourseSummaryDTO) => void;
	};

	let { courses, onEdit, onDelete}: Props = $props();

	function formatDate(date?: string) {
		if (!date) return '—';

		return new Intl.DateTimeFormat('pl-PL', {
			dateStyle: 'short',
			timeStyle: 'short'
		}).format(new Date(date));
	}
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Miejsce docelowe</TableHeaderCell>
			<TableHeaderCell>Data</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each courses as course, index (course.id ?? index)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{course.id}
				</TableCell>

				<TableCell strong>
					{course.destination ?? '—'}
				</TableCell>

				<TableCell>
					{formatDate(course.date)}
				</TableCell>

				<TableCell align="right">
					<TableActions
						item={course}
						canDelete={Boolean(course.id)}
						onEdit={() => onEdit(course)}
						onDelete={() => onDelete(course)}
					/>
				</TableCell>
			</tr>
		{/each}
	</tbody>
</TableWrapper>