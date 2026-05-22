<script lang="ts">
  import { onMount } from 'svelte';

  import {
    createPosition,
    deletePosition,
    getPositions
  } from '$lib/api/positions';

  import type { PositionDTO } from '$lib/api/types';

  import PageHeader from '$lib/components/ui/PageHeader.svelte';
  import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';

  import PositionForm from '$lib/components/positions/PositionForm.svelte';
  import PositionTable from '$lib/components/positions/PositionTable.svelte';

  let positions = $state<PositionDTO[]>([]);
  let loading = $state(false);
  let saving = $state(false);
  let error = $state<string | null>(null);

  async function loadPositions() {
    loading = true;
    error = null;

    try {
      positions = await getPositions();
    } catch {
      error = 'Nie udało się pobrać listy stanowisk.';
    } finally {
      loading = false;
    }
  }

  async function handleCreatePosition(position: string) {
    if (!position) {
      error = 'Podaj nazwę stanowiska.';
      return;
    }

    saving = true;
    error = null;

    try {
      await createPosition(position);
      await loadPositions();
    } catch {
      error = 'Nie udało się dodać stanowiska.';
    } finally {
      saving = false;
    }
  }

  async function handleDeletePosition(position: PositionDTO) {
    if (!position.id) return;

    const confirmed = window.confirm(
      `Czy na pewno usunąć stanowisko "${position.position ?? ''}"?`
    );

    if (!confirmed) return;

    error = null;

    try {
      await deletePosition(position.id);
      await loadPositions();
    } catch {
      error = 'Nie udało się usunąć stanowiska.';
    }
  }

  onMount(() => {
    loadPositions();
  });
</script>

<svelte:head>
  <title>Stanowiska</title>
</svelte:head>

<div class="mx-auto w-full max-w-6xl px-4 py-8">
  <PageHeader
    title="Stanowiska"
    description="Lista stanowisk dostępnych dla pracowników."
  />

  <PositionForm
    saving={saving}
    onCreate={handleCreatePosition}
  />

  {#if loading}
    <div class="border border-zinc-300 bg-white p-5">
      <p class="text-sm text-zinc-600">Ładowanie stanowisk...</p>
    </div>
  {:else if error}
    <ErrorMessage
      message={error}
      retry={loadPositions}
    />
  {:else if positions.length === 0}
    <EmptyState
      title="Brak stanowisk"
      description="W systemie nie ma jeszcze żadnych stanowisk."
    />
  {:else}
    <PositionTable
      positions={positions}
      onDelete={handleDeletePosition}
    />
  {/if}
</div>