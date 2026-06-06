<script lang="ts">
	type Props = {
		clientName?: string;
		onSearch: () => void | Promise<void>;
		onClear: () => void | Promise<void>;
	};

	let { clientName = $bindable(''), onSearch, onClear }: Props = $props();
</script>

<section class="mb-4 border border-zinc-300 bg-white p-4">
	<div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
		<label class="flex flex-col gap-1">
			<span class="text-sm font-medium text-zinc-700">Nazwa klienta</span>

			<input
				class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black"
				bind:value={clientName}
				placeholder="nazwa klienta"
			/>
		</label>

		<div class="flex gap-2">
			<button
				type="button"
				class="h-10 border border-black bg-black px-4 text-sm font-medium text-white hover:bg-zinc-800"
				onclick={() => void onSearch()}
			>
				Szukaj
			</button>

			<button
				type="button"
				class="h-10 border border-zinc-300 bg-white px-4 text-sm font-medium text-black hover:bg-zinc-100"
				onclick={() => void onClear()}
			>
				Wyczyść
			</button>
		</div>
	</div>
</section>
