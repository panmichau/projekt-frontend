<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import { onMount } from 'svelte';

	import { auth } from '$lib/auth/auth.svelte';

	import {
		createEmployee,
		deleteEmployee,
		getEmployee,
		getEmployees,
		updateEmployee
	} from '$lib/api/employees';

	import { getPositions } from '$lib/api/positions';
	import { getUsers } from '$lib/api/users';

	import type {
		EmployeeDTO,
		EmployeeSummaryDTO,
		PageMetadata,
		PositionDTO,
		UserSummaryDTO
	} from '$lib/api/types';

	import { buildEmployeeRequest } from '$lib/features/employees/employee-request';
	import type { EmployeeFormValue } from '$lib/features/employees/employee-form.types';

	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import EmployeeForm from '$lib/components/employees/EmployeeForm.svelte';
	import EmployeeTable from '$lib/components/employees/EmployeeTable.svelte';

	let employees = $state<EmployeeSummaryDTO[]>([]);
	let positions = $state<PositionDTO[]>([]);
	let users = $state<UserSummaryDTO[]>([]);
	let assignedUserIds = $state<number[]>([]);
	let page = $state<PageMetadata | null>(null);

	let loading = $state(false);
	let saving = $state(false);
	let deleting = $state(false);

	let error = $state<string | null>(null);
	let formError = $state<string | null>(null);

	let showForm = $state(false);
	let editedEmployee = $state<EmployeeDTO | null>(null);

	const availableUsers = $derived(
		users.filter((user) => {
			if (!user.id || !user.email) return false;

			return !assignedUserIds.includes(user.id);
		})
	);

	async function loadEmployees(pageNumber = 0) {
		loading = true;
		error = null;

		try {
			const response = await getEmployees(pageNumber, 10);

			employees = response.content ?? [];
			page = response.page ?? null;
		} catch {
			error = 'Nie udało się pobrać listy pracowników.';
		} finally {
			loading = false;
		}
	}

	async function loadAssignedUserIds() {
		const response = await getEmployees(0, 25);
		const employeeSummaries = response.content ?? [];

		const employeeDetails = await Promise.all(
			employeeSummaries
				.filter((employee) => employee.id)
				.map((employee) => getEmployee(employee.id!))
		);

		assignedUserIds = employeeDetails
			.map((employee) => employee.user?.id)
			.filter((userId): userId is number => Boolean(userId));
	}

	async function loadFormData() {
		try {
			const [positionsResponse, usersResponse] = await Promise.all([
				getPositions(),
				getUsers(0, 25)
			]);

			positions = positionsResponse;
			users = usersResponse.content ?? [];

			await loadAssignedUserIds();
		} catch {
			formError = 'Nie udało się pobrać danych formularza.';
		}
	}

	function startCreate() {
		editedEmployee = null;
		formError = null;
		showForm = true;
	}

	async function startEdit(employee: EmployeeSummaryDTO) {
		if (!employee.id) return;

		formError = null;

		try {
			editedEmployee = await getEmployee(employee.id);
			showForm = true;
		} catch {
			formError = 'Nie udało się pobrać danych pracownika.';
			showForm = true;
		}
	}

	function cancelForm() {
		showForm = false;
		editedEmployee = null;
		formError = null;
	}

	async function saveEmployee(value: EmployeeFormValue) {
		saving = true;
		formError = null;

		try {
			const request = buildEmployeeRequest(value, editedEmployee);

			if (editedEmployee?.id) {
				await updateEmployee(editedEmployee.id, request);
			} else {
				await createEmployee(request);
			}

			await Promise.all([loadEmployees(page?.number ?? 0), loadFormData()]);
			cancelForm();
		} catch {
			formError =
				value.userMode === 'existing'
					? 'Nie udało się przypisać konta. To konto może być już przypisane do innego pracownika.'
					: editedEmployee?.id
						? 'Nie udało się zapisać zmian pracownika.'
						: 'Nie udało się dodać pracownika.';
		} finally {
			saving = false;
		}
	}

	async function removeEmployee(employee: EmployeeSummaryDTO) {
		if (!employee.id) return;

		const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim();

		const confirmed = confirm(
			`Czy na pewno usunąć pracownika ${fullName || `#${employee.id}`}?`
		);

		if (!confirmed) return;

		deleting = true;
		error = null;

		try {
			await deleteEmployee(employee.id);
			await Promise.all([loadEmployees(page?.number ?? 0), loadFormData()]);
		} catch {
			error = 'Nie udało się usunąć pracownika.';
		} finally {
			deleting = false;
		}
	}

	onMount(async () => {
		await auth.init();

		if (!auth.isLoggedIn) {
			await goto(resolve('/login'));
			return;
		}

		if (!auth.hasAnyRole(['ADMIN', 'MANAGER'])) {
			await goto(resolve('/dashboard'));
			return;
		}

		await Promise.all([loadEmployees(), loadFormData()]);
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
			onclick={startCreate}
		>
			Dodaj pracownika
		</button>
	</div>

	<p class="mb-4 text-sm text-zinc-600">
		Liczba pracowników: {employees.length}
	</p>

	{#if showForm}
		{#key editedEmployee?.id ?? 'new'}
			<EmployeeForm
				employee={editedEmployee}
				{positions}
				users={availableUsers}
				{saving}
				error={formError}
				onSubmit={saveEmployee}
				onCancel={cancelForm}
			/>
		{/key}
	{/if}

	{#if loading || deleting}
		<div class="border border-zinc-300 bg-white p-5">
			<p class="text-sm text-zinc-600">
				{deleting ? 'Usuwanie pracownika...' : 'Ładowanie pracowników...'}
			</p>
		</div>
	{:else if error}
		<ErrorMessage message={error} retry={() => loadEmployees(page?.number ?? 0)} />
	{:else if employees.length === 0}
		<EmptyState
			title="Brak pracowników"
			description="W systemie nie ma jeszcze żadnych pracowników."
		/>
	{:else}
		<EmployeeTable {employees} onEdit={startEdit} onDelete={removeEmployee} />

		{#if page}
			<Pagination {page} onPageChange={loadEmployees} />
		{/if}
	{/if}
</div>