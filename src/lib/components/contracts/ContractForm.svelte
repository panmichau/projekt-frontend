<script lang="ts">
    import { untrack } from 'svelte';
    import { createForm } from 'svelte-forms-lib';
    import * as yup from 'yup';

    import type { ClientSummaryDTO, ContractDTO } from '$lib/api/types';
    import type { ContractFormValue } from '$lib/features/contracts/contract-form.types';
    import InputField from '../ui/InputField.svelte';

    type Props = {
        contract?: ContractDTO | null;
        clients: ClientSummaryDTO[];
        saving?: boolean;
        error?: string | null;
        onSubmit: (value: ContractFormValue) => void | Promise<void>;
        onCancel: () => void;
    };

    let {
        contract = null,
        clients,
        saving = false,
        error = null,
        onSubmit,
        onCancel
    }: Props = $props();

    const isEdit = $derived(Boolean(contract?.id));

    type AddressParts = { street: string; postalCode: string; city: string };

    function parseAddress(address?: string): AddressParts {
        const value = address?.trim() ?? '';
        if (!value) return { street: '', postalCode: '', city: '' };

        const match = value.match(/^(.*?),\s*(\d{2}-\d{3})\s+(.+)$/);
        if (match) {
            return {
                street: match[1] ?? '',
                postalCode: match[2] ?? '',
                city: match[3] ?? ''
            };
        }
        return { street: '', postalCode: '', city: value };
    }

    yup.setLocale({
        mixed: { default: 'Nieprawidłowa wartość', required: 'To pole nie może być puste' }
    });

    const schema = yup.object({
        name: yup.string().required().max(50, 'Nazwa może mieć maksymalnie 50 znaków'),
        clientId: yup.string().required('Wybierz klienta'),
        senderStreet: yup.string().required().max(60, 'Adres może mieć maksymalnie 60 znaków'),
        senderPostalCode: yup.string().required().matches(/^\d{2}-\d{3}$/, 'Kod pocztowy musi mieć format 00-000'),
        senderCity: yup.string().required().max(30, 'Miasto może mieć maksymalnie 30 znaków'),
        deliveryStreet: yup.string().required().max(120, 'Adres może mieć maksymalnie 120 znaków'),
        deliveryPostalCode: yup.string().required().matches(/^\d{2}-\d{3}$/, 'Kod pocztowy musi mieć format 00-000'),
        deliveryCity: yup.string().required().max(30, 'Miasto może mieć maksymalnie 30 znaków')
    });

    const { form, errors, handleSubmit } = createForm({
        initialValues: {
            name: untrack(() => contract?.name ?? ''),
            clientId: untrack(() => (contract?.client?.id ? String(contract.client.id) : '')),

            senderStreet: untrack(() => parseAddress(contract?.senderAddress).street),
            senderPostalCode: untrack(() => parseAddress(contract?.senderAddress).postalCode),
            senderCity: untrack(() => parseAddress(contract?.senderAddress).city),

            deliveryStreet: untrack(() => parseAddress(contract?.deliveryAddress).street),
            deliveryPostalCode: untrack(() => parseAddress(contract?.deliveryAddress).postalCode),
            deliveryCity: untrack(() => parseAddress(contract?.deliveryAddress).city)
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            await onSubmit(values);
        }
    });

    type AddressKey = 'senderStreet' | 'senderPostalCode' | 'senderCity' | 'deliveryStreet' | 'deliveryPostalCode' | 'deliveryCity';

    const addressSections = [
        {
            title: 'Adres nadawcy',
            fields: [
                { id: 'senderStreet' as AddressKey, label: 'Ulica i numer', placeholder: 'Ulica 1' },
                { id: 'senderPostalCode' as AddressKey, label: 'Kod pocztowy', placeholder: '00-000' },
                { id: 'senderCity' as AddressKey, label: 'Miasto', placeholder: 'Krosno' }
            ]
        },
        {
            title: 'Adres dostawy',
            fields: [
                { id: 'deliveryStreet' as AddressKey, label: 'Ulica i numer', placeholder: 'Ulica 1' },
                { id: 'deliveryPostalCode' as AddressKey, label: 'Kod pocztowy', placeholder: '00-000' },
                { id: 'deliveryCity' as AddressKey, label: 'Miasto', placeholder: 'Sanok' }
            ]
        }
    ];
</script>

<section class="mb-6 border border-zinc-300 bg-white p-5">
    <div class="mb-4 border-b border-zinc-200 pb-4">
        <h2 class="text-base font-semibold text-black">{isEdit ? 'Edycja kontraktu' : 'Nowy kontrakt'}</h2>
        <p class="text-sm text-zinc-600">{isEdit ? 'Edytujesz dane kontraktu.' : 'Dodaj nowy kontrakt przypisany do klienta.'}</p>
    </div>

    {#if error}
        <p class="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
    {/if}

    <form class="grid gap-4" onsubmit={handleSubmit} novalidate>
        <div class="grid gap-4 md:grid-cols-2">
            <InputField label="Nazwa" bind:value={$form.name} error={$errors.name} required />

            <label class="flex flex-col gap-1">
                <span class="text-sm font-medium text-zinc-700">Klient</span>
                <select class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black" bind:value={$form.clientId} required>
                    <option value="">Wybierz klienta</option>
                    {#each clients as client (client.id)}
                        {#if client.id}
                            <option value={String(client.id)}>{client.name}{client.nip ? ` - ${client.nip}` : ''}</option>
                        {/if}
                    {/each}
                </select>
                {#if $errors.clientId}<span class="text-sm text-red-800">{$errors.clientId}</span>{/if}
            </label>
        </div>

        {#each addressSections as section (section.title)}
            <section class="border border-zinc-200 p-4">
                <h3 class="mb-3 text-sm font-semibold text-black">{section.title}</h3>
                <div class="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
                    {#each section.fields as field (field.id)}
                        <InputField 
                            label={field.label} 
                            bind:value={$form[field.id]} 
                            error={$errors[field.id]} 
                            placeholder={field.placeholder}
                            required 
                        />
                    {/each}
                </div>
            </section>
        {/each}

        <div class="flex gap-3">
            <button type="submit" class="h-10 border border-black bg-black px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={saving}>
                {saving ? 'Zapisywanie...' : isEdit ? 'Zapisz zmiany' : 'Dodaj kontrakt'}
            </button>
            <button type="button" class="h-10 border border-zinc-300 bg-white px-4 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50" onclick={onCancel} disabled={saving}>
                Anuluj
            </button>
        </div>
    </form>
</section>