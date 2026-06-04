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
    import AsyncSelectField from '$lib/components/form/AsyncSelectField.svelte';

    import { getContracts } from '$lib/api/contracts';

	type Props = {
		load: LoadDTO | null;
		saving?: boolean;
		error?: string | null;
		onSubmit: (value: LoadFormValue) => void;
		onCancel: () => void;
	};

	let { load, saving = false, error = null, onSubmit, onCancel }: Props = $props();

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

	const stateOptions = [
		{ value: 'PENDING', label: 'Oczekujący' },
		{ value: 'IN_TRANSIT', label: 'W drodze' },
		{ value: 'DELIVERED', label: 'Dostarczono' },
		{ value: 'CANCELLED', label: 'Anulowano' }
	];

    async function searchContracts(search: string) {
		if (!search) return [];
		try {
			const response = await getContracts(0, 10, search);
			
			return (response.content ?? []).map((c: ContractSummaryDTO) => ({
				value: String(c.id),
				label: `${c.name ?? `Kontrakt #${c.id}`} (Klient: ${c.clientName ?? '-'})`
			}));
		} catch (e) {
			console.error("Błąd ładowania kontraktów", e);
			return [];
		}
	}

	const initialContractLabel = untrack(() =>
		load?.contract
			? `${load.contract.name ?? `Kontrakt #${load.contract.id}`} (Klient: ${load.contract.clientName ?? '-'})`
			: ''
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
			
            <AsyncSelectField
				label="Kontrakt powiązany"
				bind:value={$form.contractId}
				error={$errors.contractId}
				loadOptions={searchContracts}
				initialLabel={initialContractLabel}
				placeholder="Wpisz nazwę klienta, by wyszukać..."
				required
			/>
			<SelectField label="Stan dostawy" bind:value={$form.deliveryStateId} error={$errors.deliveryStateId} options={stateOptions} required />
		</div>

		<FormActions submitLabel="Zapisz" {saving} onCancel={onCancel} />
	</form>
</FormSection>