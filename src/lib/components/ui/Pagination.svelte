<script lang="ts">
  import type { PageMetadata } from '$lib/api/types';

  type Props = {
    page: PageMetadata;
    onPageChange: (page: number) => void | Promise<void>;
  };

  let { page, onPageChange }: Props = $props();

  const currentPage = $derived(page.number ?? 0);
  const totalPages = $derived(page.totalPages ?? 1);
</script>

<div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <p class="text-sm text-zinc-600">
    Strona
    <span class="font-medium text-black">{currentPage + 1}</span>
    z
    <span class="font-medium text-black">{totalPages}</span>
  </p>

  <div class="flex gap-2">
    <button
      class="inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage <= 0}
      onclick={() => onPageChange(currentPage - 1)}
    >
      Poprzednia
    </button>

    <button
      class="inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage + 1 >= totalPages}
      onclick={() => onPageChange(currentPage + 1)}
    >
      Następna
    </button>
  </div>
</div>