<script lang="ts">
	import { resolve } from '$app/paths';
	import Sidebar from './Sidebar.svelte';

	type Props = {
		children: import('svelte').Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="min-h-screen bg-white text-black">
	<Sidebar />

	<div class="md:pl-64">
		<header class="border-b border-zinc-300 bg-white p-4 md:hidden">
			<a href={resolve('/dashboard')} class="font-semibold"> Panel </a>
		</header>

		<main>
			{@render children()}
		</main>
	</div>
</div>
