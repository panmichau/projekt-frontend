<script lang="ts">
	import type { LoadDTO, ContractSummaryDTO } from '$lib/api/types';
	import type { LoadFormValue } from '$lib/features/loads/load-form.types';

	import { untrack } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	import FormSection from '$lib/components/form/FormSection.svelte';
	import FormError from '$lib/components/form/FormError.svelte';
	import FormActions from '$lib/components/form/FormActions.svelte';
	import InputField from '../ui/InputField.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';

	type Props = {
		load: LoadDTO | null;
		contracts: ContractSummaryDTO[];
		deliveryStates: Array<{ id: number; name: string }>;
		saving?: boolean;
		error?: string | null;
		onSubmit: (value: LoadFormValue) => void;
		onCancel: () => void;
	};

	let { load, contracts, deliveryStates, saving = false, error = null, onSubmit, onCancel }: Props = $props();

	yup.setLocale({
		mixed: { default: 'Nieprawidłowa wartość', required: 'To pole jest wymagane' },
		number: { positive: 'Wartość musi być większa od zera' }
	});

	const schema = yup.object({
		identifier: yup.string().required().max(255),
		type: yup.string().required().max(255),
		size: yup.string().required('Wybierz rozmiar ładunku'),
		weight: yup.number().typeError('Musi być liczbą').positive().required(),
		worth: yup.number().typeError('Musi być liczbą').min(0).required(),
		contractId: yup.string().required('Wybierz kontrakt'),
		deliveryStateId: yup.string().required('Wybierz stan dostawy')
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: {
			identifier: untrack(() => load?.identifier ?? ''),
			type: untrack(() => load?.type ?? ''),
			size: untrack(() => load?.size ?? ''),
			weight: untrack(() => load?.weight ? String(load.weight) : ''),
			worth: untrack(() => load?.worth !== undefined ? String(load.worth) : ''),
			contractId: untrack(() => load?.contract?.id ? String(load.contract.id) : ''),
			deliveryStateId: untrack(() => load?.deliveryState?.id ? String(load.deliveryState.id) : '')
		},
		validationSchema: schema,
		onSubmit: (values) => onSubmit(values as LoadFormValue)
	});

	const sizeOptions = [
		{ value: 'SMALL', label: 'Mały (SMALL)' },
		{ value: 'MEDIUM', label: 'Średni (MEDIUM)' },
		{ value: 'LARGE', label: 'Duży (LARGE)' }
	];

	const contractOptions = $derived(
		contracts.map((c) => ({ value: String(c.id), label: c.name ?? `Kontrakt #${c.id}` }))
	);

	const stateOptions = $derived(
		deliveryStates.map((s) => ({ value: String(s.id), label: s.name ?? `Status #${s.id}` }))
	);
</script>

<FormSection
	title={load?.id ? 'Edycja ładunku' : 'Nowy ładunek'}
	description={load?.id ? 'Edytujesz parametry istniejącego ładunku.' : 'Dodaj nowy ładunek do systemu.'}
>
	<FormError {error} />

	<form class="space-y-4" onsubmit={handleSubmit} novalidate>
		<div class="grid gap-4 md:grid-cols-2">
			<InputField label="Identyfikator" bind:value={$form.identifier} error={$errors.identifier} required />
			<InputField label="Typ" bind:value={$form.type} error={$errors.type} required />
			
			<SelectField label="Rozmiar" bind:value={$form.size} error={$errors.size} options={sizeOptions} required />
			
			<InputField label="Waga (kg)" type="number" bind:value={$form.weight} error={$errors.weight} required />
			<InputField label="Wartość" type="number" bind:value={$form.worth} error={$errors.worth} required />
			
			<SelectField label="Kontrakt" bind:value={$form.contractId} error={$errors.contractId} options={contractOptions} required />
			<SelectField label="Stan dostawy" bind:value={$form.deliveryStateId} error={$errors.deliveryStateId} options={stateOptions} required />
		</div>

		<FormActions submitLabel="Zapisz" {saving} onCancel={onCancel} />
	</form>
</FormSection>