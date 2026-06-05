<script lang="ts">
	import type { EmployeeDTO, PositionDTO, UserSummaryDTO } from '$lib/api/types';

	import type {
		EmployeeFormValue,
		EmployeeUserMode
	} from '$lib/features/employees/employee-form.types';

	import { untrack } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	import FormSection from '$lib/components/form/FormSection.svelte';
	import FormError from '$lib/components/form/FormError.svelte';
	import InputField from '../ui/InputField.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';
	import EmployeeUserModeField from '$lib/components/employees/EmployeeUserModeField.svelte';
	import FormActions from '$lib/components/form/FormActions.svelte';
	import InfoBox from '$lib/components/form/InfoBox.svelte';

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
	const hasAssignedUser = $derived(Boolean(employee?.user?.id));

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

		userMode: yup.mixed<EmployeeUserMode>().required(),

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

					if (userMode === 'new') {
						return value !== undefined && value.trim().length >= 8;
					}

					return true;
				}
			)
			.test('conditional-password', 'To pole nie może być puste', function (value) {
				const userMode = this.parent.userMode;

				if (userMode === 'new') {
					return value !== undefined && value.trim() !== '';
				}

				return true;
			})
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: {
			firstName: untrack(() => employee?.firstName ?? ''),
			lastName: untrack(() => employee?.lastName ?? ''),
			phoneNumber: untrack(() => employee?.phoneNumber ?? ''),
			position: untrack(() => (employee?.position?.id ? String(employee.position.id) : '')),

			userMode: untrack<EmployeeUserMode>(() => {
				if (employee?.user?.id) return 'existing';
				return 'none';
			}),
			userId: untrack(() => (employee?.user?.id ? String(employee.user.id) : '')),
			email: untrack(() => employee?.user?.email ?? ''),
			password: ''
		},

		validationSchema: schema,

		onSubmit: async (values) => {
			await onSubmit({
				firstName: values.firstName,
				lastName: values.lastName,
				phoneNumber: values.phoneNumber,
				position: values.position,
				userMode: values.userMode as EmployeeUserMode,
				userId: values.userId,
				email: values.email,
				password: values.password
			});
		}
	});

	const positionOptions = $derived(
		positions
			.filter((position) => position.id !== undefined)
			.map((position) => ({
				value: String(position.id),
				label: position.position ?? ''
			}))
	);

	const availableUsers = $derived(
	users.filter((user) => {
		if (!user.id || !user.email) return false;

		return !(user.roles ?? []).includes('ADMIN');
	})
);

	const availableUserOptions = $derived(
		availableUsers.map((user) => ({
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

		{#if isEdit && hasAssignedUser}
			<InfoBox
				title="Przypisane konto użytkownika"
				text={`Konto jest już przypisane: ${employee?.user?.email ?? ''}`}
			/>
		{:else}
			<EmployeeUserModeField bind:value={$form.userMode} showNewOption={!isEdit} />

			{#if $form.userMode === 'existing'}
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
			{:else if $form.userMode === 'new'}
				<InputField
					label="Email konta użytkownika"
					type="email"
					bind:value={$form.email}
					error={$errors.email}
					required
				/>

				<InputField
					label="Hasło"
					type="password"
					bind:value={$form.password}
					error={$errors.password}
					required
				/>
			{:else}
				<InfoBox text="Pracownik zostanie zapisany bez konta użytkownika." />
			{/if}
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