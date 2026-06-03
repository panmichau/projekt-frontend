<script lang="ts">
	import type { ClientDTO } from '$lib/api/types';
	import type { ClientFormValue } from '$lib/features/clients/client-form.types';

	import { untrack } from 'svelte';

	import FormSection from '$lib/components/form/FormSection.svelte';
	import FormError from '$lib/components/form/FormError.svelte';
	import FormActions from '$lib/components/form/FormActions.svelte';
	import InputField from '../ui/InputField.svelte';

	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	type Props = {
		client: ClientDTO | null;
		saving?: boolean;
		error?: string | null;
		onSubmit: (value: ClientFormValue) => void;
		onCancel: () => void;
	};

	let { client, saving = false, error = null, onSubmit, onCancel }: Props = $props();

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
		name: yup.string().required().max(100, 'Nazwa może mieć maksymalnie 100 znaków'),
		nip: yup
			.string()
			.required()
			.matches(/^\d{10}$/, 'NIP musi składać się z 10 cyfr')
			.min(10, 'NIP musi mieć 10 znaków')
			.max(10, 'NIP musi mieć 10 znaków'),
		phoneNumber: yup.string().required().max(12, 'Numer telefonu może mieć maksymalnie 12 znaków'),
		email: yup.string().email().max(255, 'Email może mieć maksymalnie 255 znaków')
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: {
			name: untrack(() => client?.name ?? ''),
			nip: untrack(() => client?.nip ?? ''),
			phoneNumber: untrack(() => client?.phoneNumber ?? ''),
			email: untrack(() => client?.email ?? '')
		},
		validationSchema: schema,
		onSubmit: (values) => {
			const name = values.name;
			const nip = values.nip;
			const phoneNumber = values.phoneNumber;
			const email = values.email;

			onSubmit({
				name,
				nip,
				phoneNumber,
				email
			});
		}
	});
</script>

<FormSection
	title={client?.id ? 'Edycja klienta' : 'Nowy klient'}
	description={client?.id ? 'Edytujesz dane klienta.' : 'Dodaj nowego klienta do systemu.'}
>
	<FormError {error} />

	<form class="space-y-4" onsubmit={handleSubmit} novalidate>
		<div class="grid gap-4 md:grid-cols-2">
			<InputField
				label="Nazwa"
				bind:value={$form.name}
				error={$errors.name}
				maxlength={100}
				required
			/>

			<InputField
				label="NIP"
				bind:value={$form.nip}
				error={$errors.nip}
				maxlength={10}
				required
			/>

			<InputField
				label="Telefon"
				bind:value={$form.phoneNumber}
				error={$errors.phoneNumber}
				maxlength={12}
				required
			/>

			<InputField
				label="Email (opcjonalnie)"
				type="email"
				bind:value={$form.email}
				error={$errors.email}
				maxlength={255}
			/>
		</div>

		<FormActions
			submitLabel={client?.id ? 'Zapisz zmiany' : 'Dodaj klienta'}
			savingLabel="Zapisywanie..."
			{saving}
			{onCancel}
		/>
	</form>
</FormSection>
