<script lang="ts">
	import type { LoadDTO } from '$lib/api/types';
	import DetailsSection from '$lib/components/ui/DetailsSection.svelte';
	import DetailItem from '$lib/components/ui/DetailItem.svelte';

	let { load, onClose }: { load: LoadDTO; onClose: () => void; } = $props();
</script>

<DetailsSection
	title={`Szczegóły ładunku: ${load.identifier}`}
	description="Pełne informacje o parametrach ładunku, przypisanym kontrakcie i statusie."
	{onClose}
>
	<DetailItem label="ID" value={load.id} />
	<DetailItem label="Identyfikator" value={load.identifier} />
	<DetailItem label="Typ" value={load.type} />
	<DetailItem label="Rozmiar" value={load.size} />
	
	<DetailItem label="Waga">
		{load.weight} kg
	</DetailItem>
	
	<DetailItem label="Wartość">
		{load.worth} PLN
	</DetailItem>
	
	<DetailItem label="Kontrakt (ID)">
		{load.contract ? `#${load.contract.id} - ${load.contract.name}` : 'Brak przypisania'}
	</DetailItem>
	
	<DetailItem label="Klient">
		{load.contract?.clientName ?? '-'}
	</DetailItem>

	<DetailItem label="Status dostawy">
		<span class="rounded bg-zinc-100 px-2 py-1 text-xs font-semibold uppercase text-zinc-600">
			{load.deliveryState}
		</span>
	</DetailItem>
</DetailsSection>