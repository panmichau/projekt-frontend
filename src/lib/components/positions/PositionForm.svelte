<script lang="ts">
  type Props = {
    saving: boolean;
    onCreate: (position: string) => void;
  };

  let { saving, onCreate }: Props = $props();

  let position = $state('');

  function handleSubmit() {
    const value = position.trim();

    if (!value) {
      onCreate('');
      return;
    }

    onCreate(value);
    position = '';
  }
</script>

<form
  class="mb-6 flex gap-3 border border-zinc-300 bg-white p-4"
  onsubmit={(event) => {
    event.preventDefault();
    handleSubmit();
  }}
>
  <input
    bind:value={position}
    placeholder="Nazwa stanowiska"
    class="h-10 flex-1 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
  />

  <button
    type="submit"
    disabled={saving}
    class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {saving ? 'Dodawanie...' : 'Dodaj'}
  </button>
</form>