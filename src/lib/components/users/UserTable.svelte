<script lang="ts">
	import type { UserSummaryDTO } from '$lib/api/types';
	import { auth } from '$lib/auth/auth.svelte';
	import TableCell from '$lib/components/table/TableCell.svelte';
	import TableHeaderCell from '$lib/components/table/TableHeaderCell.svelte';
	import TableWrapper from '$lib/components/table/TableWrapper.svelte';

	type Props = {
		users: UserSummaryDTO[];
		onEditRoles: (user: UserSummaryDTO) => void;
		editRoles?: string[];
	};

	let { users, onEditRoles, editRoles = ['ADMIN'] }: Props = $props();
</script>

<TableWrapper>
	<thead class="bg-zinc-100">
		<tr>
			<TableHeaderCell>ID</TableHeaderCell>
			<TableHeaderCell>Email</TableHeaderCell>
			<TableHeaderCell>Role</TableHeaderCell>
			<TableHeaderCell align="right">Akcje</TableHeaderCell>
		</tr>
	</thead>

	<tbody>
		{#each users as user, index (user.id ?? index)}
			<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
				<TableCell nowrap>
					{user.id ?? '-'}
				</TableCell>

				<TableCell strong>
					{user.email ?? '-'}
				</TableCell>

				<TableCell>
					{#if user.roles?.length}
						<div class="flex flex-wrap gap-1.5">
							{#each user.roles as role (role)}
								<span
									class="border border-zinc-300 bg-white px-2 py-0.5 text-xs font-medium text-black"
								>
									{role}
								</span>
							{/each}
						</div>
					{:else}
						-
					{/if}
				</TableCell>

				<TableCell align="right">
					{#if auth.hasAnyRole(editRoles)}
						<button
							type="button"
							class="inline-flex h-9 items-center justify-center border border-zinc-300 bg-white px-3 text-sm font-medium text-black hover:bg-zinc-100"
							onclick={() => onEditRoles(user)}
						>
							Edytuj role
						</button>
					{/if}
				</TableCell>
			</tr>
		{:else}
			<tr>
				<td colspan="4" class="p-8 text-center text-sm italic text-zinc-400">
					Brak użytkowników na liście.
				</td>
			</tr>
		{/each}
	</tbody>
</TableWrapper>
