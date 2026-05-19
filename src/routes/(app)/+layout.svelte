<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { onMount } from 'svelte';

  import { auth } from '$lib/auth/auth.svelte';
  import AppShell from '$lib/components/layout/AppShell.svelte';

  let { children } = $props();

  onMount(async () => {
    await auth.init();

    if (!auth.isLoggedIn) {
      await goto(resolve('/login'));
    }
  });
</script>

{#if auth.loading && !auth.initialized}
  <div class="flex min-h-screen items-center justify-center bg-white text-black">
    <p class="text-sm text-zinc-600">Ładowanie...</p>
  </div>
{:else if auth.isLoggedIn}
  <AppShell>
    {@render children()}
  </AppShell>
{/if}