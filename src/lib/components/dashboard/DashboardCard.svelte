<script lang="ts">
	type Props = {
		title: string;
		description: string;
		href: string;
	};

	let { title, description, href }: Props = $props();
</script>

<a class="block border border-zinc-300 bg-white p-5 text-black transition hover:bg-zinc-100" {href}>
	<h3 class="mb-2 text-base font-semibold">
		{title}
	</h3>

	<p class="text-sm leading-6 text-zinc-600">
		{description}
	</p>
</a>
