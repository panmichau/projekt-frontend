<script lang="ts">
  type Props = {
    title: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
  };

  let {
    title,
    description,
    backHref,
    backLabel = 'Wróć'
  }: Props = $props();
</script>

<header class="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-black">
      {title}
    </h1>

    {#if description}
      <p class="mt-1 text-sm text-zinc-600">
        {description}
      </p>
    {/if}
  </div>

  {#if backHref}
    <a
      class="inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100"
      href={backHref}
    >
      {backLabel}
    </a>
  {/if}
</header>