<script lang="ts">
	import type { EmployeeDTO, PositionDTO, UserSummaryDTO } from '$lib/api/types';

	import type {
		EmployeeFormValue,
		EmployeeUserMode
	} from '$lib/features/employees/employee-form.types';

	type Props = {
		employee?: EmployeeDTO | null;
		positions: PositionDTO[];
		users: UserSummaryDTO[];
		saving?: boolean;
		error?: string | null;
		onSubmit: (value: EmployeeFormValue) => void | Promise<void>;
		onCancel: () => void;
	};

	let {
		employee = null,
		positions,
		users,
		saving = false,
		error = null,
		onSubmit,
		onCancel
	}: Props = $props();

	let firstName = $state('');
	let lastName = $state('');
	let phoneNumber = $state('');
	let position = $state('');

	let userMode = $state<EmployeeUserMode>('new');
	let userId = $state('');

	let email = $state('');
	let password = $state('');

	let currentEmployeeId = $state<number | null>(null);

	const isEdit = $derived(Boolean(employee?.id));

	const availableUsers = $derived(
	users.filter((user) => Boolean(user.id && user.email))
);
	$effect(() => {
		const nextEmployeeId = employee?.id ?? null;

		if (currentEmployeeId === nextEmployeeId) return;

		currentEmployeeId = nextEmployeeId;

		firstName = employee?.firstName ?? '';
		lastName = employee?.lastName ?? '';
		phoneNumber = employee?.phoneNumber ?? '';
		position = employee?.position?.id ? String(employee.position.id) : '';

		userMode = 'new';
		userId = employee?.user?.id ? String(employee.user.id) : '';

		email = employee?.user?.email ?? '';
		password = '';
	});

	async function submit() {
		await onSubmit({
			firstName,
			lastName,
			phoneNumber,
			position,
			userMode,
			userId,
			email,
			password
		});
	}
</script>

<section class="mb-6 border border-zinc-300 bg-white p-5">
	<div class="mb-4 border-b border-zinc-200 pb-4">
		<h2 class="text-base font-semibold text-black">
			{isEdit ? 'Edycja pracownika' : 'Nowy pracownik'}
		</h2>

		<p class="text-sm text-zinc-600">
			{isEdit
				? 'Edytujesz dane pracownika oraz powiązane konto użytkownika.'
				: 'Utwórz nowe konto użytkownika albo przypisz istniejące konto.'}
		</p>
	</div>

	{#if error}
		<p class="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
			{error}
		</p>
	{/if}

	<form
		class="grid gap-4 md:grid-cols-2"
		onsubmit={(event) => {
			event.preventDefault();
			submit();
		}}
	>
		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Imię</span>
			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={firstName}
				required
			/>
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Nazwisko</span>
			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={lastName}
				required
			/>
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Telefon</span>
			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={phoneNumber}
			/>
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Stanowisko</span>
			<select
				class="h-10 border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
				bind:value={position}
				required
			>
				<option value="">Wybierz stanowisko</option>

				{#each positions as item (item.id)}
					{#if item.id}
						<option value={String(item.id)}>
							{item.position}
						</option>
					{/if}
				{/each}
			</select>
		</label>

		{#if !isEdit}
			<div class="md:col-span-2">
				<p class="mb-2 text-sm font-medium text-zinc-700">Konto użytkownika</p>

				<div class="flex flex-col gap-2 md:flex-row">
					<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
						<input type="radio" bind:group={userMode} value="new" />
						<span>Utwórz nowe konto</span>
					</label>

					<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
						<input type="radio" bind:group={userMode} value="existing" />
						<span>Wybierz istniejące konto</span>
					</label>
				</div>
			</div>
		{/if}

		{#if !isEdit && userMode === 'existing'}
			<label class="flex flex-col gap-1 md:col-span-2">
				<span class="text-sm font-medium text-zinc-700">Istniejące konto</span>

				<select
					class="h-10 border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
					bind:value={userId}
					required
				>
					<option value="">Wybierz konto użytkownika</option>

					{#each availableUsers as user (user.id)}
						<option value={String(user.id)}>
							{user.email} — {(user.roles ?? ['NONE']).join(', ')}
						</option>
					{/each}
				</select>

				{#if availableUsers.length === 0}
					<span class="text-xs text-zinc-500">
						Brak dostępnych kont z rolą NONE.
					</span>
				{/if}
			</label>
		{:else}
			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium text-zinc-700">Email konta użytkownika</span>
				<input
					class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
					type="email"
					bind:value={email}
					required
				/>
			</label>

			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium text-zinc-700">
					Hasło {isEdit ? '(zostaw puste, żeby nie zmieniać)' : ''}
				</span>
				<input
					class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
					type="password"
					bind:value={password}
					required={!isEdit && userMode === 'new'}
				/>
			</label>
		{/if}

		<div class="flex items-end justify-end gap-3 md:col-span-2">
			<button
				type="button"
				class="inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100"
				onclick={onCancel}
			>
				Anuluj
			</button>

			<button
				type="submit"
				class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={saving}
			>
				{saving ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Dodaj pracownika'}
			</button>
		</div>
	</form>
</section>