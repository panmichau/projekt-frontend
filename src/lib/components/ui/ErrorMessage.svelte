<script lang="ts">
  type Props = {
    message: string;
    retry?: () => void | Promise<void>;
  };

  let { message, retry }: Props = $props();
</script>

<div class="border border-zinc-300 bg-white p-5">
  <p class="text-sm font-medium text-black">{message}</p>

  {#if retry}
    <button
      class="mt-4 inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100"
      onclick={() => retry?.()}
    >
      Spróbuj ponownie
    </button>
  {/if}
</div>