<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		label: string;
		type?: HTMLInputAttributes['type'];
		value: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		required?: boolean;
		placeholder?: string;
	};

	let {
		label,
		type = 'text',
		value = $bindable(),
		autocomplete,
		required = false,
		placeholder
	}: Props = $props();
</script>

<label class="block">
	<span class="mb-1 block text-sm font-medium text-black">
		{label}
	</span>

	<input
		class="block w-full border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black"
		bind:value
		{type}
		{autocomplete}
		{required}
		{placeholder}
	/>
</label>
