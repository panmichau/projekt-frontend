<script lang="ts">
	import { untrack } from 'svelte';

	type SelectOption = {
		value: string;
		label: string;
	};

	let {
		label,
		value = $bindable(),
		error = null,
		placeholder = 'Wpisz, aby wyszukać...',
		required = false,
		loadOptions,
		initialLabel = ''
	}: {
		label: string;
		value: string;
		error?: string | null;
		placeholder?: string;
		required?: boolean;
		loadOptions: (search: string) => Promise<SelectOption[]>;
		initialLabel?: string;
	} = $props();

	let searchTerm = $state(untrack(() => initialLabel));
	let options = $state<SelectOption[]>([]);
	let isOpen = $state(false);
	let isLoading = $state(false);
	let timeoutId = $state<ReturnType<typeof setTimeout> | null>(null);

	async function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchTerm = target.value;
		isOpen = true;

		value = '';

		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(async () => {
			isLoading = true;
			try {
				options = await loadOptions(searchTerm);
			} catch (err) {
				console.error('Błąd pobierania opcji', err);
			} finally {
				isLoading = false;
			}
		}, 2000);
	}

	function selectOption(opt: SelectOption) {
		value = opt.value;
		searchTerm = opt.label;
		isOpen = false;
	}

	function handleBlur() {
		setTimeout(() => {
			isOpen = false;
			if (!value) {
				searchTerm = '';
			}
		}, 200);
	}
</script>

<div class="relative flex flex-col gap-1">
	<span class="text-sm font-medium text-zinc-700">{label}</span>

	<input
		type="text"
		class="h-10 border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-black"
		bind:value={searchTerm}
		oninput={handleInput}
		onfocus={() => {
			if (searchTerm || options.length > 0) isOpen = true;
		}}
		onblur={handleBlur}
		{placeholder}
		{required}
	/>

	{#if isOpen}
		<ul
			class="absolute top-full left-0 z-10 max-h-60 w-full overflow-y-auto border border-zinc-300 bg-white shadow-lg"
		>
			{#if isLoading}
				<li class="p-3 text-sm text-zinc-500">Szukanie...</li>
			{:else if options.length === 0 && searchTerm.length > 0}
				<li class="p-3 text-sm text-zinc-500">Brak wyników dla "{searchTerm}"</li>
			{:else if options.length === 0}
				<li class="p-3 text-sm text-zinc-500">Zacznij pisać, aby wyszukać...</li>
			{:else}
				{#each options as opt (opt.value)}
					<li>
						<button
							type="button"
							class="w-full cursor-pointer p-3 text-left hover:bg-zinc-100"
							onmousedown={() => selectOption(opt)}
						>
							{opt.label}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}

	{#if error}
		<span class="text-sm text-red-800">{error}</span>
	{/if}
</div>
