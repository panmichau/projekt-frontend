<script lang="ts">
  type Props = {
    title: string;
    description?: string;
  };

  let { title, description }: Props = $props();
</script>

<div class="border border-dashed border-zinc-300 bg-white p-8 text-center">
  <h2 class="text-base font-semibold text-black">
    {title}
  </h2>

  {#if description}
    <p class="mt-2 text-sm text-zinc-600">
      {description}
    </p>
  {/if}
</div>