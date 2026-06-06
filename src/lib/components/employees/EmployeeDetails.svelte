<script lang="ts">
	import type { EmployeeDTO } from '$lib/api/types';
	import DetailsSection from '$lib/components/ui/DetailsSection.svelte';
	import DetailItem from '$lib/components/ui/DetailItem.svelte';

	let { employee, onClose }: { employee: EmployeeDTO; onClose: () => void } = $props();
</script>

<DetailsSection
	title={`Pracownik: ${employee.firstName} ${employee.lastName}`}
	description="Informacje kadrowe pracownika i powiązane konto w systemie."
	{onClose}
>
	<DetailItem label="ID Pracownika" value={employee.id} />
	<DetailItem label="Imię" value={employee.firstName} />
	<DetailItem label="Nazwisko" value={employee.lastName} />
	<DetailItem label="Telefon" value={employee.phoneNumber} />

	<DetailItem label="Stanowisko">
		{employee.position?.position ?? '-'}
	</DetailItem>

	<DetailItem label="Konto użytkownika">
		{#if employee.user?.email}
			<span class="text-blue-600">{employee.user.email}</span>
		{:else}
			Brak przypisanego konta
		{/if}
	</DetailItem>

	<DetailItem label="Liczba kursów">
		{employee.courses?.length ?? 0}
	</DetailItem>
</DetailsSection>
