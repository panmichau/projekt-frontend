<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  import { register } from '$lib/api/auth';

  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = $state('');
  let password = $state('');
  let repeatedPassword = $state('');
  let error = $state<string | null>(null);
  let loading = $state(false);

  async function handleSubmit() {
    error = null;

    if (password !== repeatedPassword) {
      error = 'Hasła nie są takie same.';
      return;
    }

    loading = true;

    try {
      await register({ email, password });
      await goto(resolve('/login'));
    } catch {
      error = 'Nie udało się utworzyć konta.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Rejestracja</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-12">
  <div class="w-full max-w-sm">
    <div class="mb-8 border-b border-zinc-200 pb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-black">
        Rejestracja
      </h1>

      <p class="mt-1 text-sm text-zinc-600">
        Utwórz konto użytkownika.
      </p>
    </div>

    <form
      class="space-y-5"
      onsubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <TextInput
        label="Email"
        type="email"
        bind:value={email}
        autocomplete="email"
        required
      />

      <TextInput
        label="Hasło"
        type="password"
        bind:value={password}
        autocomplete="new-password"
        required
      />

      <TextInput
        label="Powtórz hasło"
        type="password"
        bind:value={repeatedPassword}
        autocomplete="new-password"
        required
      />

      {#if error}
        <div class="border border-zinc-300 bg-white p-3">
          <p class="text-sm font-medium text-black">{error}</p>
        </div>
      {/if}

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? 'Tworzenie konta...' : 'Zarejestruj'}
      </Button>

      <p class="text-center text-sm text-zinc-600">
        Masz już konto?
        <a class="font-medium text-black underline" href={resolve('/login')}>
          Zaloguj się
        </a>
      </p>
    </form>
  </div>
</div>