<script lang="ts">
	import type { ContractDTO } from '$lib/api/types';
	import DetailsSection from '$lib/components/ui/DetailsSection.svelte';
	import DetailItem from '$lib/components/ui/DetailItem.svelte';

	let { contract, onClose }: { contract: ContractDTO; onClose: () => void } = $props();
</script>

<DetailsSection
	title={`Szczegóły kontraktu: ${contract.name ?? '#' + contract.id}`}
	description="Szczegóły adresowe i przypisany klient."
	{onClose}
>
	<DetailItem label="ID Kontraktu" value={contract.id} />
	<DetailItem label="Nazwa" value={contract.name} />

	<DetailItem label="Klient">
		{contract.client ? `${contract.client.name} (NIP: ${contract.client.nip})` : 'Brak przypisania'}
	</DetailItem>

	<DetailItem label="Adres nadawcy" value={contract.senderAddress} />
	<DetailItem label="Adres dostawy" value={contract.deliveryAddress} />
</DetailsSection>
