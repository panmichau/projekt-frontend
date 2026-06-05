<script lang="ts">
	import type { ClientDTO } from '$lib/api/types';
	import DetailsSection from '$lib/components/ui/DetailsSection.svelte';
	import DetailItem from '$lib/components/ui/DetailItem.svelte';

	let { client, onClose }: { client: ClientDTO; onClose: () => void; } = $props();
</script>

<DetailsSection
	title={`Szczegóły klienta: ${client.name}`}
	description="Pełne dane kontaktowe i identyfikacyjne klienta."
	{onClose}
>
	<DetailItem label="ID" value={client.id} />
	<DetailItem label="Nazwa" value={client.name} />
	<DetailItem label="NIP" value={client.nip} />
	<DetailItem label="Telefon" value={client.phoneNumber} />
	<DetailItem label="Email" value={client.email} />
	
	<DetailItem label="Liczba kontraktów">
		{client.contracts?.length ?? 0}
	</DetailItem>
</DetailsSection>