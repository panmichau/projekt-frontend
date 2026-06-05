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
                    {#if load.id !== undefined && load.id !== null}
                        {@const id = load.id}
                        
                        <div class="flex flex-col border border-zinc-200 bg-white p-2 text-sm text-black">
                            <label class="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={selectedLoadIds.includes(id)}
                                    onchange={() => onToggle(id)}
                                    class="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>
                                    {load.identifier ?? `Ładunek #${id}`}
                                    {#if load.contract?.name}
                                        <span class="text-zinc-500">- {load.contract.name}</span>
                                    {/if}
                                </span>
                            </label>

                            {#if isAssignedToAnotherCourse(load)}
                                <p class="ml-6 mt-1 text-xs text-amber-700 select-none">
                                    Uwaga: ten ładunek jest już przypisany do kursu #{load.courseId}.
                                    Przypisanie go tutaj może przepiąć go do tego kursu.
                                </p>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>