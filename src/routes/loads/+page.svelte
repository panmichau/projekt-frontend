<script lang="ts">
	import { onMount } from 'svelte';
	import { LoadsState } from '$lib/features/loads/loads.svelte';

	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import LoadForm from '$lib/components/loads/LoadForm.svelte';
	import LoadTable from '$lib/components/loads/LoadTable.svelte';

	const state = new LoadsState();

	onMount(async () => {
		await Promise.all([
			state.loadLoads(),
			state.loadFormData()
		]);
	});
</script>

<svelte:head>
	<title>Ładunki</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
	<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<PageHeader title="Ładunki" description="Ewidencja i zarządzanie ładunkami." />

		<button
			type="button"
			class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
			onclick={() => state.startCreate()}
		>
			Dodaj ładunek
		</button>
	</div>

	<p class="mb-4 text-sm text-zinc-600">
		Liczba ładunków na tej stronie: {state.loads.length}
	</p>

	{#if state.showForm}
		{#key state.editedLoad?.id ?? 'new'}
			<LoadForm
				load={state.editedLoad}
				contracts={state.contracts}
				deliveryStates={state.deliveryStates}
				saving={state.saving}
				error={state.formError}
				onSubmit={(val) => state.saveLoad(val)}
				onCancel={() => state.cancelForm()}
			/>
		{/key}
	{/if}

	{#if state.loading || state.deleting}
		<div class="border border-zinc-300 bg-white p-5">
			<p class="text-sm text-zinc-600">
				{state.deleting ? 'Usuwanie ładunku...' : 'Ładowanie listy ładunków...'}
			</p>
		</div>
	{:else if state.error}
		<ErrorMessage message={state.error} retry={() => state.loadLoads()} />
	{:else if state.loads.length === 0}
		<EmptyState title="Brak ładunków" description="W bazie danych nie znaleziono żadnych ładunków. Kliknij przycisk powyżej, aby dodać pierwszy."/>
	{:else}
		<LoadTable
			loads={state.loads}
			onEdit={(load) => state.startEdit(load)}
			onDelete={(load) => state.removeLoad(load)}
		/>

		{#if state.page}
			<Pagination page={state.page} onPageChange={(p) => state.loadLoads(p)} />
		{/if}
	{/if}
</div>