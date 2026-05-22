<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	import { auth } from '$lib/auth/auth.svelte';
	import { getUsers, updateUser } from '$lib/api/users';
	import type { PageMetadata, UserSummaryDTO } from '$lib/api/types';

	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	import UserRoleEditor from '$lib/components/users/UserRoleEditor.svelte';
	import UserTable from '$lib/components/users/UserTable.svelte';

	type Role = 'NONE' | 'DRIVER' | 'FORWARDER' | 'MANAGER' | 'ADMIN';

	let users = $state<UserSummaryDTO[]>([]);
	let page = $state<PageMetadata | null>(null);
	let loading = $state(false);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let editError = $state<string | null>(null);

	let editedUser = $state<UserSummaryDTO | null>(null);
	let selectedRoles = $state<Role[]>([]);

	async function loadUsers(pageNumber = 0) {
		loading = true;
		error = null;

		try {
			const response = await getUsers(pageNumber, 10);

			users = response.content ?? [];
			page = response.page ?? null;
		} catch {
			error = 'Nie udało się pobrać listy użytkowników.';
		} finally {
			loading = false;
		}
	}

	function startEdit(user: UserSummaryDTO) {
		editedUser = user;
		selectedRoles = (user.roles ?? []).filter((role): role is Role => role !== 'NONE');
		editError = null;
	}

	function cancelEdit() {
		editedUser = null;
		selectedRoles = [];
		editError = null;
	}

	function toggleRole(role: Role) {
		if (selectedRoles.includes(role)) {
			selectedRoles = selectedRoles.filter((item) => item !== role);
		} else {
			selectedRoles = [...selectedRoles, role];
		}
	}

	async function saveRoles() {
		if (!editedUser?.id) return;

		saving = true;
		editError = null;

		try {
			await updateUser({
				id: editedUser.id,
				email: editedUser.email,
				roles: selectedRoles.length > 0 ? selectedRoles : ['NONE']
			});

			await loadUsers(page?.number ?? 0);
			cancelEdit();
		} catch {
			editError = 'Nie udało się zapisać ról użytkownika.';
		} finally {
			saving = false;
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

		await loadUsers();
	});
</script>

<svelte:head>
	<title>Użytkownicy</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
	<PageHeader title="Użytkownicy" description="Lista kont użytkowników w systemie." />
	<p class="mb-4 text-sm text-zinc-600">
		Liczba użytkowników: {users.length}
	</p>

	{#if editedUser}
		<UserRoleEditor
			user={editedUser}
			{selectedRoles}
			{saving}
			error={editError}
			onToggleRole={toggleRole}
			onSave={saveRoles}
			onCancel={cancelEdit}
		/>
	{/if}

	{#if loading}
		<div class="border border-zinc-300 bg-white p-5">
			<p class="text-sm text-zinc-600">Ładowanie użytkowników...</p>
		</div>
	{:else if error}
		<ErrorMessage message={error} retry={() => loadUsers(page?.number ?? 0)} />
	{:else if users.length === 0}
		<EmptyState
			title="Brak użytkowników"
			description="W systemie nie ma jeszcze żadnych kont użytkowników."
		/>
	{:else}
		<UserTable {users} onEditRoles={startEdit} />

		{#if page}
			<Pagination {page} onPageChange={loadUsers} />
		{/if}
	{/if}
</div>
