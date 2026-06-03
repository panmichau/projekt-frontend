<script lang="ts">
	import type { EmployeeDTO, PositionDTO, UserSummaryDTO } from '$lib/api/types';

	import type {
		EmployeeFormValue,
		EmployeeUserMode
	} from '$lib/features/employees/employee-form.types';
	import { untrack } from 'svelte';
	import FormSection from '$lib/components/form/FormSection.svelte';
	import FormError from '$lib/components/form/FormError.svelte';
	import InputField from '../ui/InputField.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';
	import EmployeeUserModeField from '$lib/components/employees/EmployeeUserModeField.svelte';
	import FormActions from '$lib/components/form/FormActions.svelte';
	
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
	const positionOptions = $derived(
	positions
		.filter((item) => item.id)
		.map((item) => ({
			value: String(item.id),
			label: item.position ?? ''
		}))
	);

	const availableUserOptions = $derived(
	availableUsers
		.filter((user) => user.id)
		.map((user) => ({
			value: String(user.id),
			label: `${user.email} - ${(user.roles ?? ['NONE']).join(', ')}`
		}))
	);
</script>

<FormSection
	title={isEdit ? 'Edycja pracownika' : 'Nowy pracownik'}
	description={isEdit
		? 'Edytujesz dane pracownika oraz powiązane konto użytkownika.'
		: 'Zapisz pracownika bez konta, utwórz nowe konto albo przypisz istniejące konto użytkownika.'}
>
	<FormError {error} />

	<form class="grid gap-4 md:grid-cols-2" onsubmit={handleSubmit} novalidate>
		<InputField label="Imię" bind:value={$form.firstName} error={$errors.firstName} required />

		<InputField label="Nazwisko" bind:value={$form.lastName} error={$errors.lastName} required />

		<InputField label="Telefon" bind:value={$form.phoneNumber} error={$errors.phoneNumber} required />

		<SelectField
			label="Stanowisko"
			bind:value={$form.position}
			error={$errors.position}
			options={positionOptions}
			placeholder="Wybierz stanowisko"
			required
		/>

		{#if !isEdit}
			<EmployeeUserModeField bind:value={$form.userMode} />
		{/if}

		{#if ($form.userMode === 'existing' && !isEdit) || (isEdit && !employee?.user?.id)}
			<SelectField
				label="Istniejące konto"
				bind:value={$form.userId}
				error={$errors.userId}
				options={availableUserOptions}
				placeholder="Wybierz konto użytkownika"
				required
				colSpan
			/>

			{#if availableUsers.length === 0}
				<span class="text-xs text-zinc-500 md:col-span-2">
					Brak dostępnych kont bez przypisanego pracownika.
				</span>
			{/if}
		{:else if $form.userMode === 'new' || (isEdit && employee?.user?.id)}
			<InputField
				label="Email konta użytkownika"
				type="email"
				bind:value={$form.email}
				error={$errors.email}
				required
			/>

			<InputField
				label={`Hasło ${isEdit ? '(zostaw puste, żeby nie zmieniać)' : ''}`}
				type="password"
				bind:value={$form.password}
				error={$errors.password}
				required={!isEdit && $form.userMode === 'new'}
			/>
		{:else}
			<p class="border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:col-span-2">
				Pracownik zostanie zapisany bez konta użytkownika.
			</p>
		{/if}

		<div class="md:col-span-2">
		<FormActions
		submitLabel={isEdit ? 'Zapisz zmiany' : 'Dodaj pracownika'}
		savingLabel="Zapisywanie..."
		{saving}
		{onCancel}
		/>
		</div>
	</form>
</FormSection>