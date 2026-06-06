<script lang="ts">
	import { auth } from '$lib/auth/auth.svelte';
	import { onMount } from 'svelte';
	import CourseDetails from '$lib/components/courses/CourseDetails.svelte';
	import CourseForm from '$lib/components/courses/CourseForm.svelte';
	import CourseTable from '$lib/components/courses/CourseTable.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { CoursesState } from '$lib/features/courses/courses.svelte';

	const state = new CoursesState();
	const editRoles = ['FORWARDER', 'MANAGER', 'ADMIN'];

	onMount(() => {
		void state.loadCourses();
	});
</script>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
	<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<PageHeader title="Kursy" description="Planowanie i obsługa kursów transportowych." />

		{#if auth.hasAnyRole(editRoles)}
			<button
				type="button"
				class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
				onclick={() => void state.startCreate()}
			>
				Dodaj kurs
			</button>
		{/if}
	</div>

	<p class="mb-4 text-sm text-zinc-600">
		Liczba kursów: {state.courses.length}
	</p>

	{#if state.showForm}
		{#key state.editedCourse?.id ?? 'new'}
			<CourseForm
				course={state.editedCourse}
				employees={state.employees}
				loads={state.loads}
				error={state.formError}
				saving={state.saving}
				onSubmit={(value) => void state.saveCourse(value)}
				onCancel={() => state.cancelForm()}
			/>
		{/key}
	{/if}
	{#if state.showDetails && state.viewedCourse}
		<CourseDetails course={state.viewedCourse} onClose={() => state.closeDetails()} />
	{/if}

	{#if state.loading || state.deleting}
		<div class="border border-zinc-300 bg-white p-5">
			<p class="text-sm text-zinc-600">
				{state.deleting ? 'Usuwanie kursu...' : 'Ładowanie kursów...'}
			</p>
		</div>
	{:else if state.error}
		<ErrorMessage
			message={state.error}
			retry={() => void state.loadCourses(state.page?.number ?? 0)}
		/>
	{:else if state.courses.length === 0}
		<EmptyState title="Brak kursów" description="W systemie nie ma jeszcze żadnych kursów." />
	{:else}
		<CourseTable
			courses={state.courses}
			onView={(course) => void state.startView(course)}
			onEdit={(course) => void state.startEdit(course)}
			onDelete={(course) => void state.removeCourse(course)}
			{editRoles}
		/>

		{#if state.page}
			<Pagination page={state.page} onPageChange={(page) => void state.loadCourses(page)} />
		{/if}
	{/if}
</div>
