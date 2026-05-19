<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth/auth.svelte';
  import {resolve} from '$app/paths';


  onMount(async () => {
    await auth.init();

    if (auth.isLoggedIn) {
      await goto(resolve('/dashboard'));
    } else {
      await goto(resolve('/login'));
    }
  });
</script>

<p>Przekierowywanie...</p>