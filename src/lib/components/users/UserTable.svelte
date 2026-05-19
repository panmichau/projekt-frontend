<script lang="ts">
  import type { UserSummaryDTO } from '$lib/api/types';

  type Props = {
    users: UserSummaryDTO[];
    onEditRoles: (user: UserSummaryDTO) => void;
  };

  let { users, onEditRoles }: Props = $props();
</script>

<div class="overflow-hidden border border-zinc-300 bg-white">
  <table class="min-w-full border-collapse">
    <thead class="bg-zinc-100">
      <tr>
        <th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
          ID
        </th>

        <th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
          Email
        </th>

        <th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
          Role
        </th>

        <th class="border-b border-zinc-300 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-700">
          Akcje
        </th>
      </tr>
    </thead>

    <tbody>
      {#each users as user (user.id)}
        <tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
          <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-700">
            {user.id}
          </td>

          <td class="px-4 py-3 text-sm font-medium text-black">
            {user.email ?? '-'}
          </td>

          <td class="px-4 py-3 text-sm text-zinc-700">
            {#if user.roles?.length}
              <div class="flex flex-wrap gap-1.5">
                {#each user.roles as role (role)}
                  <span class="border border-zinc-300 bg-white px-2 py-0.5 text-xs font-medium text-black">
                    {role}
                  </span>
                {/each}
              </div>
            {:else}
              -
            {/if}
          </td>

          <td class="px-4 py-3 text-right">
            <button
              class="inline-flex h-9 items-center justify-center border border-zinc-300 bg-white px-3 text-sm font-medium text-black hover:bg-zinc-100"
              onclick={() => onEditRoles(user)}
            >
              Edytuj role
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>