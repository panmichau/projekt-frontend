<script lang="ts">
  import type { PositionDTO } from '$lib/api/types';

  type Props = {
    positions: PositionDTO[];
    onDelete: (position: PositionDTO) => void;
  };

  let { positions, onDelete }: Props = $props();
</script>

<div class="overflow-hidden border border-zinc-300 bg-white">
  <table class="min-w-full border-collapse">
    <thead class="bg-zinc-100">
      <tr>
        <th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
          ID
        </th>

        <th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
          Stanowisko
        </th>

        <th class="border-b border-zinc-300 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-700">
          Akcje
        </th>
      </tr>
    </thead>

    <tbody>
      {#each positions as item, index (item.id ?? index)}
        <tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
          <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-700">
            {item.id}
          </td>

          <td class="px-4 py-3 text-sm font-medium text-black">
            {item.position ?? '-'}
          </td>

          <td class="px-4 py-3 text-right">
            {#if item.id}
              <button
                type="button"
                onclick={() => onDelete(item)}
                class="text-sm font-medium text-red-700 hover:text-red-900"
              >
                Usuń
              </button>
            {:else}
              <span class="text-sm text-zinc-400">Brak ID</span>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>