<script lang="ts">
	import type { ClientDTO } from '$lib/api/types';
	import type { ClientFormValue } from '$lib/features/clients/client-form.types';

	import { untrack } from 'svelte';

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

<section class="mb-6 border border-zinc-300 bg-white p-5">
	<div class="mb-4 border-b border-zinc-200 pb-4">
		<h2 class="text-base font-semibold text-black">
			{client?.id ? 'Edycja klienta' : 'Nowy klient'}
		</h2>

		<p class="text-sm text-zinc-600">
			{client?.id ? 'Edytujesz dane klienta.' : 'Dodaj nowego klienta do systemu.'}
		</p>
	</div>

	{#if error}
		<p class="mb-4 border border-red-300 bg-red-50 p-3 text-sm text-red-700">
			{error}
		</p>
	{/if}

	<form class="space-y-4" onsubmit={handleSubmit} novalidate>
		<div class="grid gap-4 md:grid-cols-2">
			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">Nazwa</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					bind:value={$form.name}
					maxlength="100"
					required
				/>
				{#if $errors.name}
					<span class="text-sm text-red-800">{$errors.name}</span>
				{/if}
			</label>

			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">NIP</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					bind:value={$form.nip}
					maxlength="10"
					required
				/>
				{#if $errors.nip}
					<span class="text-sm text-red-800">{$errors.nip}</span>
				{/if}
			</label>

			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">Telefon</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					bind:value={$form.phoneNumber}
					maxlength="12"
					required
				/>
				{#if $errors.phoneNumber}
					<span class="text-sm text-red-800">{$errors.phoneNumber}</span>
				{/if}
			</label>

			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">Email (opcjonalnie)</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					type="email"
					bind:value={$form.email}
					maxlength="255"
				/>
				{#if $errors.email}
					<span class="text-sm text-red-800">{$errors.email}</span>
				{/if}
			</label>
		</div>

		<div class="flex gap-2">
			<button
				class="border border-black bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
				type="submit"
				disabled={saving}
			>
				{saving ? 'Zapisywanie...' : client?.id ? 'Zapisz zmiany' : 'Dodaj klienta'}
			</button>

			<button
				class="border border-zinc-300 px-4 py-2 text-sm font-medium"
				type="button"
				onclick={onCancel}
				disabled={saving}
			>
				Anuluj
			</button>
		</div>
	</form>
</section>
