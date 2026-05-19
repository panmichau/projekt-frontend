<script lang="ts">
  import type { UserSummaryDTO } from '$lib/api/types';

  type Role = 'NONE' | 'DRIVER' | 'FORWARDER' | 'MANAGER' | 'ADMIN';

  type Props = {
    user: UserSummaryDTO;
    selectedRoles: Role[];
    saving?: boolean;
    error?: string | null;
    onToggleRole: (role: Role) => void;
    onSave: () => void | Promise<void>;
    onCancel: () => void;
  };

  let {
    user,
    selectedRoles,
    saving = false,
    error = null,
    onToggleRole,
    onSave,
    onCancel
  }: Props = $props();

  const availableRoles: Role[] = ['DRIVER', 'FORWARDER', 'MANAGER', 'ADMIN'];
</script>

<section class="mb-6 border border-zinc-300 bg-white p-5">
  <div class="mb-4 flex flex-col gap-1 border-b border-zinc-200 pb-4">
    <h2 class="text-base font-semibold text-black">
      Edycja ról użytkownika
    </h2>

    <p class="text-sm text-zinc-600">
      {user.email}
    </p>
  </div>

  <div class="flex flex-wrap gap-3">
    {#each availableRoles as role (role)}
      <label class="inline-flex items-center gap-2 border border-zinc-300 bg-white px-3 py-2 text-sm text-black">
        <input
          type="checkbox"
          checked={selectedRoles.includes(role)}
          onchange={() => onToggleRole(role)}
        />

        <span>{role}</span>
      </label>
    {/each}
  </div>

  {#if error}
    <p class="mt-4 text-sm font-medium text-black">
      {error}
    </p>
  {/if}

  <div class="mt-5 flex gap-2">
    <button
      class="inline-flex h-10 items-center justify-center border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={saving}
      onclick={onSave}
    >
      {saving ? 'Zapisywanie...' : 'Zapisz role'}
    </button>

    <button
      class="inline-flex h-10 items-center justify-center border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100"
      disabled={saving}
      onclick={onCancel}
    >
      Anuluj
    </button>
  </div>
</section>