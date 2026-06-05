<script lang="ts">
	import type { CourseDTO } from '$lib/api/types';
	import DetailsSection from '$lib/components/ui/DetailsSection.svelte';
	import DetailItem from '$lib/components/ui/DetailItem.svelte';

	let { course, onClose }: { course: CourseDTO; onClose: () => void } = $props();
</script>

<DetailsSection
	title={`Kurs: ${course.destination ?? `#${course.id}`}`}
	description="Informacje o kursie, kierowcy i przypisanych ładunkach."
	{onClose}
>
	<DetailItem label="ID Kursu" value={course.id} />
	<DetailItem label="Miejsce docelowe" value={course.destination} />
	<DetailItem label="Data" value={course.date} />
	<DetailItem label="Koszt" value={course.cost} />

	<DetailItem label="Kierowca">
		{#if course.driver}
			{course.driver.firstName} {course.driver.lastName}
		{:else}
			-
		{/if}
	</DetailItem>

	<DetailItem label="Opis">
		{course.description ?? '-'}
	</DetailItem>

	<DetailItem label="Liczba ładunków">
		{course.loads?.length ?? 0}
	</DetailItem>

	<DetailItem label="Ładunki">
		{#if course.loads && course.loads.length > 0}
			<div class="flex flex-col gap-1">
				{#each course.loads as load, index (load.id ?? index)}
					<span>
						{load.identifier ?? `Ładunek #${load.id}`}
						{#if load.contract?.name}
							<span class="text-zinc-500"> - {load.contract.name}</span>
						{/if}
					</span>
				{/each}
			</div>
		{:else}
			-
		{/if}
	</DetailItem>
</DetailsSection>