<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth/auth.svelte';

  let { children } = $props();

  onMount(() => {
    void auth.init();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{#if auth.loading && !auth.initialized}
  <p>Ładowanie...</p>
{:else}
  {@render children()}
{/if}