<script lang="ts">
	import type { LoadDTO } from '$lib/api/types';

	import InfoBox from '$lib/components/form/InfoBox.svelte';

	type Props = {
		loads: LoadDTO[];
		selectedLoadIds: number[];
		currentCourseId?: number | null;
		onToggle: (loadId: number) => void;
	};

	let {
		loads,
		selectedLoadIds,
		currentCourseId = null,
		onToggle
	}: Props = $props();

	function isAssignedToAnotherCourse(load: LoadDTO) {
		return Boolean(load.courseId && load.courseId !== currentCourseId);
	}
</script>

<div class="grid gap-2 md:col-span-2">
	<span class="text-sm font-medium text-black">Ładunki</span>

	{#if loads.length === 0}
		<InfoBox text="Brak dostępnych ładunków do przypisania." />
	{:else}
		<div class="max-h-64 overflow-y-auto border border-zinc-300 bg-white p-3">
			<div class="grid gap-2">
				{#each loads as load (load.id)}
					{#if load.id}
						<label
							class="grid gap-1 border border-zinc-200 bg-white px-3 py-2 text-sm text-black"
						>
							<div class="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedLoadIds.includes(load.id)}
									onchange={() => onToggle(load.id!)}
								/>

								<span>
									{load.identifier ?? `Ładunek #${load.id}`}
									{#if load.contract?.name}
										— {load.contract.name}
									{/if}
								</span>
							</div>

							{#if isAssignedToAnotherCourse(load)}
								<p class="ml-6 text-xs text-amber-700">
									Uwaga: ten ładunek jest już przypisany do kursu #{load.courseId}.
									Przypisanie go tutaj może przepiąć go do tego kursu.
								</p>
							{/if}
						</label>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>