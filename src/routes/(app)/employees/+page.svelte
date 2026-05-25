<script lang="ts">
    import { onMount } from 'svelte';
    import { EmployeesState } from '$lib/features/employees/employees.svelte';

    import PageHeader from '$lib/components/ui/PageHeader.svelte';
    import Pagination from '$lib/components/ui/Pagination.svelte';
    import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
    import EmptyState from '$lib/components/ui/EmptyState.svelte';

    import EmployeeForm from '$lib/components/employees/EmployeeForm.svelte';
    import EmployeeTable from '$lib/components/employees/EmployeeTable.svelte';

    const state = new EmployeesState();

    onMount(async () => {
        await Promise.all([state.loadEmployees(), state.loadFormData()]);
    });
</script>

<svelte:head>
    <title>Pracownicy</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
    <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader title="Pracownicy" description="Lista pracowników firmy." />

        <button
            type="button"
            class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
            onclick={() => state.startCreate()}
        >
            Dodaj pracownika
        </button>
    </div>

    <p class="mb-4 text-sm text-zinc-600">
        Liczba pracowników: {state.employees.length}
    </p>

    {#if state.showForm}
        {#key state.editedEmployee?.id ?? 'new'}
            <EmployeeForm
                employee={state.editedEmployee}
                positions={state.positions}
                users={state.availableUsers}
                saving={state.saving}
                error={state.formError}
                onSubmit={(val) => state.saveEmployee(val)}
                onCancel={() => state.cancelForm()}
            />
        {/key}
    {/if}

    {#if state.loading || state.deleting}
        <div class="border border-zinc-300 bg-white p-5">
            <p class="text-sm text-zinc-600">
                {state.deleting ? 'Usuwanie pracownika...' : 'Ładowanie pracowników...'}
            </p>
        </div>
    {:else if state.error}
        <ErrorMessage message={state.error} retry={() => state.loadEmployees(state.page?.number ?? 0)} />
    {:else if state.employees.length === 0}
        <EmptyState
            title="Brak pracowników"
            description="W systemie nie ma jeszcze żadnych pracowników."
        />
    {:else}
        <EmployeeTable 
            employees={state.employees} 
            onEdit={(emp) => state.startEdit(emp)} 
            onDelete={(emp) => state.removeEmployee(emp)} 
        />

        {#if state.page}
            <Pagination page={state.page} onPageChange={(p) => state.loadEmployees(p)} />
        {/if}
    {/if}
</div>