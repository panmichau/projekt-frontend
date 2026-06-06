<script lang="ts">
	import { onMount } from 'svelte';

	import { ClientsState } from '$lib/features/clients/clients.svelte';

	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import ClientForm from '$lib/components/clients/ClientForm.svelte';
	import ClientTable from '$lib/components/clients/ClientTable.svelte';
	import ClientDetails from '$lib/components/clients/ClientDetails.svelte';
	import { auth } from '$lib/auth/auth.svelte';

	const state = new ClientsState();
	const editRoles = ['FORWARDER', 'MANAGER', 'ADMIN'];

	onMount(async () => {
		await state.loadClients();
	});
</script>

<svelte:head>
	<title>Klienci</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
	<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<PageHeader title="Klienci" description="Lista klientów i dane kontaktowe." />

		{#if auth.hasAnyRole(editRoles)}
			<button
				type="button"
				class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
				onclick={() => state.startCreate()}
			>
				Dodaj klienta
			</button>
		{/if}
	</div>

	<p class="mb-4 text-sm text-zinc-600">
		Liczba klientów: {state.clients.length}
	</p>

	{#if state.showForm}
		{#key state.editedClient?.id ?? 'new'}
			<ClientForm
				client={state.editedClient}
				saving={state.saving}
				error={state.formError}
				onSubmit={(val) => state.saveClient(val)}
				onCancel={() => state.cancelForm()}
			/>
		{/key}
	{/if}

	{#if state.showDetails && state.viewedClient}
		<ClientDetails client={state.viewedClient} onClose={() => state.closeDetails()} />
	{/if}

	{#if state.loading || state.deleting}
		<div class="border border-zinc-300 bg-white p-5">
			<p class="text-sm text-zinc-600">
				{state.deleting ? 'Usuwanie klienta...' : 'Ładowanie klientów...'}
			</p>
		</div>
	{:else if state.error}
		<ErrorMessage message={state.error} retry={() => state.loadClients(state.page?.number ?? 0)} />
	{:else if state.clients.length === 0}
		<EmptyState title="Brak klientów" description="W systemie nie ma jeszcze żadnych klientów." />
	{:else}
		<ClientTable
			clients={state.clients}
			onView={(client) => state.startView(client)}
			onEdit={(client) => state.startEdit(client)}
			onDelete={(client) => state.removeClient(client)}
			{editRoles}
		/>

		{#if state.page}
			<Pagination page={state.page} onPageChange={(p) => state.loadClients(p)} />
		{/if}
	{/if}
</div>
