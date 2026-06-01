<script lang="ts">
	import type { EmployeeDTO, PositionDTO, UserSummaryDTO } from '$lib/api/types';

	import type {
		EmployeeFormValue,
		EmployeeUserMode
	} from '$lib/features/employees/employee-form.types';
	import { untrack } from 'svelte';

	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

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

	const isEdit = $derived(Boolean(employee?.id));

	yup.setLocale({
		mixed: {
			default: 'Nieprawidłowa wartość',
			required: 'To pole nie może być puste'
		},
		string: {
			email: 'Nieprawidłowy email'
		}
	});

	const schema = yup.object({
		firstName: yup.string().required().max(50, 'Imię może mieć maksymalnie 50 znaków'),
		lastName: yup.string().required().max(50, 'Nazwisko może mieć maksymalnie 50 znaków'),
		phoneNumber: yup.string().required().max(12, 'Numer telefonu może mieć maksymalnie 12 znaków'),
		position: yup.string().required(),

		userMode: yup.mixed().required(),
		userId: yup.string().when('userMode', {
			is: 'existing',
			then: (schema) => schema.required(),
			otherwise: (schema) => schema.notRequired()
		}),
		email: yup
			.string()
			.email()
			.max(255, 'Email może mieć maksymalnie 255 znaków')
			.when('userMode', {
				is: 'new',
				then: (schema) => schema.required(),
				otherwise: (schema) => schema.notRequired()
			}),
		password: yup
			.string()
			.max(255, 'Hasło może mieć maksymalnie 255 znaków')
			.test(
				'conditional-password-length',
				'Hasło musi mieć przynajmniej 8 znaków',
				function (value) {
					const userMode = this.parent.userMode;

					if (userMode === 'new' && !isEdit) return value !== undefined && value.trim().length >= 8;
					return true;
				}
			)
			.test('conditional-password', 'To pole jest nie może być puste', function (value) {
				const userMode = this.parent.userMode;

				if (userMode === 'new' && !isEdit) return value !== undefined && value.trim() !== '';
				return true;
			})
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: {
			firstName: untrack(() => employee?.firstName ?? ''),
			lastName: untrack(() => employee?.lastName ?? ''),
			phoneNumber: untrack(() => employee?.phoneNumber ?? ''),
			position: untrack(() => (employee?.position?.id ? String(employee.position.id) : '')),

			userMode: untrack(() => (employee?.user?.id ? 'new' : 'existing')),
			userId: untrack(() => (employee?.user?.id ? String(employee.user.id) : '')),
			email: untrack(() => employee?.user?.email ?? ''),
			password: ''
		},
		validationSchema: schema,
		onSubmit: async (values) => {
			const firstName = values.firstName;
			const lastName = values.lastName;
			const phoneNumber = values.phoneNumber;
			const position = values.position;
			const userMode = values.userMode as EmployeeUserMode;
			const userId = values.userId;
			const email = values.email;
			const password = values.password;

			console.log(userId);

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
	});

	const availableUsers = $derived(users.filter((user) => Boolean(user.id && user.email)));
</script>

<section class="mb-6 border border-zinc-300 bg-white p-5">
	<div class="mb-4 border-b border-zinc-200 pb-4">
		<h2 class="text-base font-semibold text-black">
			{isEdit ? 'Edycja pracownika' : 'Nowy pracownik'}
		</h2>

		<p class="text-sm text-zinc-600">
			{isEdit
				? 'Edytujesz dane pracownika oraz powiązane konto użytkownika.'
				: 'Zapisz pracownika bez konta, utwórz nowe konto albo przypisz istniejące konto użytkownika.'}
		</p>
	</div>

	{#if error}
		<p class="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
			{error}
		</p>
	{/if}

	<form class="grid gap-4 md:grid-cols-2" onsubmit={handleSubmit} novalidate>
		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Imię</span>
			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={$form.firstName}
				required
			/>
			{#if $errors.firstName}
				<span class="text-sm text-red-800">{$errors.firstName}</span>
			{/if}
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Nazwisko</span>
			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={$form.lastName}
				required
			/>
			{#if $errors.lastName}
				<span class="text-sm text-red-800">{$errors.lastName}</span>
			{/if}
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Telefon</span>
			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={$form.phoneNumber}
			/>
			{#if $errors.phoneNumber}
				<span class="text-sm text-red-800">{$errors.phoneNumber}</span>
			{/if}
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Stanowisko</span>
			<select
				class="h-10 border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
				bind:value={$form.position}
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
			{#if $errors.position}
				<span class="text-sm text-red-800">{$errors.position}</span>
			{/if}
		</label>

		{#if !isEdit}
			<div class="md:col-span-2">
				<p class="mb-2 text-sm font-medium text-zinc-700">Konto użytkownika</p>

				<div class="flex flex-col gap-2 md:flex-row">
					<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
						<input type="radio" bind:group={$form.userMode} value="none" />
						<span>Bez konta</span>
					</label>

					<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
						<input type="radio" bind:group={$form.userMode} value="new" />
						<span>Utwórz nowe konto</span>
					</label>

					<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
						<input type="radio" bind:group={$form.userMode} value="existing" />
						<span>Wybierz istniejące konto</span>
					</label>
				</div>
			</div>
		{/if}

		{#if ($form.userMode === 'existing' && !isEdit) || (isEdit && !employee?.user?.id)}
			<label class="flex flex-col gap-1 md:col-span-2">
				<span class="text-sm font-medium text-zinc-700">Istniejące konto</span>

				<select
					class="h-10 border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
					bind:value={$form.userId}
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
						Brak dostępnych kont bez przypisanego pracownika.
					</span>
				{/if}

				{#if $errors.userId}
					<span class="text-sm text-red-800">{$errors.userId}</span>
				{/if}
			</label>
		{:else if $form.userMode === 'new' || (isEdit && employee?.user?.id)}
			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium text-zinc-700">Email konta użytkownika</span>
				<input
					class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
					type="email"
					bind:value={$form.email}
					required
				/>
				{#if $errors.email}
					<span class="text-sm text-red-800">{$errors.email}</span>
				{/if}
			</label>

			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium text-zinc-700">
					Hasło {isEdit ? '(zostaw puste, żeby nie zmieniać)' : ''}
				</span>
				<input
					class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
					type="password"
					bind:value={$form.password}
					required={!isEdit && $form.userMode === 'new'}
				/>
				{#if $errors.password}
					<span class="text-sm text-red-800">{$errors.password}</span>
				{/if}
			</label>
		{:else}
			<p class="border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:col-span-2">
				Pracownik zostanie zapisany bez konta użytkownika.
			</p>
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
