<script lang="ts">
	import type { CourseSummaryDTO } from '$lib/api/types';

	import TableActions from '$lib/components/table/TableActions.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';

	type Props = {
		courses: CourseSummaryDTO[];
		onView: (course: CourseSummaryDTO) => void;
		onEdit: (course: CourseSummaryDTO) => void;
		onDelete: (course: CourseSummaryDTO) => void;
		editRoles: string[];
	};

	let { courses, onView, onEdit, onDelete, editRoles }: Props = $props();

	const EMPTY_VALUE = '-';

	const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
		dateStyle: 'short',
		timeStyle: 'short'
	});

	function formatDate(date?: string) {
		if (!date) return EMPTY_VALUE;

		const parsedDate = new Date(date);

		if (isNaN(parsedDate.getTime())) return EMPTY_VALUE;

		return dateFormatter.format(parsedDate);
	}

	function formatDestination(destination?: string) {
		return destination?.trim() || EMPTY_VALUE;
	}
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Miejsce docelowe</TableHeaderCell>
			<TableHeaderCell>Termin kursu</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each courses as course, index (course.id ?? index)}
			{@const destination = formatDestination(course.destination)}

			<tr class="border-b border-zinc-200 transition-colors last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{course.id ?? EMPTY_VALUE}
				</TableCell>

				<TableCell strong>
					<span title={destination}>
						{destination}
					</span>
				</TableCell>

				<TableCell nowrap>
					{formatDate(course.date)}
				</TableCell>

				<TableCell align="right">
					<TableActions
						item={course}
						canDelete={course.id !== undefined && course.id !== null}
						onView={() => onView(course)}
						onEdit={() => onEdit(course)}
						onDelete={() => onDelete(course)}
						{editRoles}
					/>
				</TableCell>
			</tr>
		{:else}
			<tr>
				<td colspan="4" class="p-8 text-center text-sm italic text-zinc-400">
					Brak kursów na liście.
				</td>
			</tr>
		{/each}
	</tbody>
</TableWrapper>
