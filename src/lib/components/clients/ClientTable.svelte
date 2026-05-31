<script lang="ts">
	import type { ClientSummaryDTO } from '$lib/api/types';

	type Props = {
		clients: ClientSummaryDTO[];
		onEdit: (client: ClientSummaryDTO) => void;
		onDelete: (client: ClientSummaryDTO) => void;
	};

	let { clients, onEdit, onDelete }: Props = $props();
</script>

<div class="overflow-hidden border border-zinc-300 bg-white">
	<table class="min-w-full border-collapse">
		<thead class="bg-zinc-100">
			<tr>
				<th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold tracking-wide text-zinc-700 uppercase">
					ID
				</th>
				<th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold tracking-wide text-zinc-700 uppercase">
					Nazwa
				</th>
				<th class="border-b border-zinc-300 px-4 py-3 text-left text-xs font-semibold tracking-wide text-zinc-700 uppercase">
					NIP
				</th>
				<th class="border-b border-zinc-300 px-4 py-3 text-right text-xs font-semibold tracking-wide text-zinc-700 uppercase">
					Akcje
				</th>
			</tr>
		</thead>

		<tbody>
			{#each clients as client, index (client.id ?? index)}
				<tr class="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50">
					<td class="px-4 py-3 text-sm whitespace-nowrap text-zinc-700">
						{client.id}
					</td>

					<td class="px-4 py-3 text-sm font-medium text-black">
						{client.name ?? '-'}
					</td>

					<td class="px-4 py-3 text-sm text-zinc-700">
						{client.nip ?? '-'}
					</td>

					<td class="px-4 py-3 text-right">
						<div class="flex justify-end gap-3">
							<button
								class="text-sm font-medium text-black hover:text-zinc-700"
								onclick={() => onEdit(client)}
							>
								Edytuj
							</button>

							{#if client.id}
								<button
									class="text-sm font-medium text-red-700 hover:text-red-900"
									onclick={() => onDelete(client)}
								>
									Usuń
								</button>
							{:else}
								<span class="text-sm text-zinc-500">Brak ID</span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>