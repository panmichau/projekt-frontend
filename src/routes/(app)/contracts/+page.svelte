<script lang="ts">
	import { onMount } from 'svelte';

	import { ContractsState } from '$lib/features/contracts/contracts.svelte';

	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import ContractForm from '$lib/components/contracts/ContractForm.svelte';
	import ContractTable from '$lib/components/contracts/ContractTable.svelte';
	import ContractFilters from '$lib/components/contracts/ContractFilters.svelte';
	import ContractDetails from '$lib/components/contracts/ContractDetails.svelte';

	const state = new ContractsState();

	const editRoles = ['FORWARDER', 'MANAGER', 'ADMIN'];

	onMount(async () => {
		await state.loadContracts();
	});
</script>

<svelte:head>
	<title>Kontrakty</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
	<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<PageHeader title="Kontrakty" description="Lista kontraktów klientów." />

		<button
			type="button"
			class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
			onclick={() => void state.startCreate()}
		>
			Dodaj kontrakt
		</button>
	</div>

	<ContractFilters
		bind:clientName={state.clientName}
		onSearch={() => state.search()}
		onClear={() => state.clearFilters()}
	/>

	<p class="mb-4 text-sm text-zinc-600">
		Liczba kontraktów: {state.contracts.length}
	</p>

	{#if state.showForm}
		{#key state.editedContract?.id ?? 'new'}
			<ContractForm
				contract={state.editedContract}
				clients={state.clients}
				saving={state.saving}
				error={state.formError}
				onSubmit={(value) => state.saveContract(value)}
				onCancel={() => state.cancelForm()}
			/>
		{/key}
	{/if}

	{#if state.showDetails && state.viewedContract}
		<ContractDetails contract={state.viewedContract} onClose={() => state.closeDetails()} />
	{/if}

	{#if state.loading || state.deleting}
		<div class="border border-zinc-300 bg-white p-5">
			<p class="text-sm text-zinc-600">
				{state.deleting ? 'Usuwanie kontraktu...' : 'Ładowanie kontraktów...'}
			</p>
		</div>
	{:else if state.error}
		<ErrorMessage
			message={state.error}
			retry={() => state.loadContracts(state.page?.number ?? 0)}
		/>
	{:else if state.contracts.length === 0}
		<EmptyState
			title="Brak kontraktów"
			description="W systemie nie ma jeszcze żadnych kontraktów."
		/>
	{:else}
		<ContractTable
			contracts={state.contracts}
			onEdit={(contract) => void state.startEdit(contract)}
			onDelete={(contract) => void state.removeContract(contract)}
			onView={(contract) => state.startView(contract)}
			{editRoles}
		/>

		{#if state.page}
			<Pagination page={state.page} onPageChange={(p) => state.loadContracts(p)} />
		{/if}
	{/if}
</div>
