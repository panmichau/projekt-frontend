<script lang="ts">
	let {
		value = $bindable(),
		showNewOption = true
	}: {
		value: string;
		showNewOption?: boolean;
	} = $props();
</script>

<div class="md:col-span-2">
	<p class="mb-2 text-sm font-medium text-zinc-700">Konto użytkownika</p>

	<div class="flex flex-col gap-2 md:flex-row">
		<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
			<input type="radio" bind:group={value} value="none" />
			<span>Bez konta</span>
		</label>

		{#if showNewOption}
			<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
				<input type="radio" bind:group={value} value="new" />
				<span>Utwórz nowe konto</span>
			</label>
		{/if}

		<label class="flex items-center gap-2 border border-zinc-300 px-3 py-2 text-sm">
			<input type="radio" bind:group={value} value="existing" />
			<span>Wybierz istniejące konto</span>
		</label>
	</div>
</div>