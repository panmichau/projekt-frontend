<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  

  import { auth } from '$lib/auth/auth.svelte';
  import { appModules } from '$lib/navigation/app-modules';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();

  const visibleModules = $derived(
    appModules.filter((module) => auth.hasAnyRole(module.roles))
  );

  const pathname = $derived(page.url.pathname);
</script>

<div class="min-h-screen bg-white text-black">
  <aside class="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-300 bg-white md:block">
    <div class="flex h-full flex-col">
      <div class="border-b border-zinc-300 p-5">
        <a href={resolve('/dashboard')} class="text-lg font-semibold tracking-tight">
          Panel
        </a>

        {#if auth.user}
          <p class="mt-2 truncate text-sm text-zinc-600">
            {auth.user.email}
          </p>
        {/if}
      </div>

      <nav class="flex-1 space-y-1 p-3">
        <a
          href={resolve('/dashboard')}
          class={`block border px-3 py-2 text-sm font-medium ${
            pathname === '/app/dashboard'
              ? 'border-black bg-black text-white'
              : 'border-transparent text-black hover:border-zinc-300 hover:bg-zinc-100'
          }`}
        >
          Dashboard
        </a>

        {#each visibleModules as module (module.href)}
          <a
            href={module.href}
            class={`block border px-3 py-2 text-sm font-medium ${
              pathname === module.href
                ? 'border-black bg-black text-white'
                : 'border-transparent text-black hover:border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            {module.title}
          </a>
        {/each}
      </nav>

      <div class="border-t border-zinc-300 p-3">
        <div class="mb-3 flex flex-wrap gap-1.5">
          {#each auth.roles as role (role)}
            <span class="border border-zinc-300 px-2 py-0.5 text-xs font-medium">
              {role}
            </span>
          {/each}
        </div>

        <button
          class="w-full border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100"
          onclick={() => auth.logout()}
        >
          Wyloguj
        </button>
      </div>
    </div>
  </aside>

  <div class="md:pl-64">
    <header class="border-b border-zinc-300 bg-white p-4 md:hidden">
      <a href={resolve('/dashboard')} class="font-semibold">
        Panel
      </a>
    </header>

    <main>
      {@render children()}
    </main>
  </div>
</div>