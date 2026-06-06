<script lang="ts">
	type SelectOption = {
		value: string;
		label: string;
	};

	let {
		label,
		value = $bindable(),
		error = null,
		options,
		placeholder = 'Wybierz...',
		required = false,
		colSpan = false
	}: {
		label: string;
		value: string;
		error?: string | null;
		options: SelectOption[];
		placeholder?: string;
		required?: boolean;
		colSpan?: boolean;
	} = $props();
</script>

<label class={colSpan ? 'flex flex-col gap-1 md:col-span-2' : 'flex flex-col gap-1'}>
	<span class="text-sm font-medium text-zinc-700">{label}</span>

	<select
		class="h-10 border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
		bind:value
		{required}
	>
		<option value="">{placeholder}</option>

		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>

	{#if error}
		<span class="text-sm text-red-800">{error}</span>
	{/if}
</label>
