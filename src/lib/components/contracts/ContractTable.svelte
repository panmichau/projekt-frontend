<script lang="ts">
	import type { ContractSummaryDTO } from '$lib/api/types';

	type Props = {
		contracts: ContractSummaryDTO[];
		onEdit: (contract: ContractSummaryDTO) => void;
		onDelete: (contract: ContractSummaryDTO) => void;
	};

	let { contracts, onEdit, onDelete }: Props = $props();
</script>

<div class="overflow-x-auto border border-zinc-300 bg-white">
	<table class="w-full border-collapse text-left text-sm">
		<thead class="bg-zinc-100 text-zinc-700">
			<tr>
				<th class="border-b border-zinc-300 px-4 py-3">ID</th>
				<th class="border-b border-zinc-300 px-4 py-3">Nazwa</th>
				<th class="border-b border-zinc-300 px-4 py-3 text-right">Akcje</th>
			</tr>
		</thead>

		<tbody>
			{#each contracts as contract (contract.id)}
				<tr class="border-b border-zinc-200">
					<td class="px-4 py-3">{contract.id}</td>
					<td class="px-4 py-3">{contract.name}</td>

					<td class="px-4 py-3">
						<div class="flex justify-end gap-2">
							<button
								type="button"
								class="h-9 border border-zinc-300 bg-white px-3 text-sm font-medium text-black"
								onclick={() => onEdit(contract)}
							>
								Edytuj
							</button>

							<button
								type="button"
								class="h-9 border border-zinc-300 bg-white px-3 text-sm font-medium text-black"
								onclick={() => onDelete(contract)}
							>
								Usuń
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>