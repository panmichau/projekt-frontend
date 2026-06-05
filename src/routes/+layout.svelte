<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { PUBLIC_GA_MEASUREMENT_ID } from '$env/static/public';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { auth } from '$lib/auth/auth.svelte';

	let { children } = $props();

	const gaId = PUBLIC_GA_MEASUREMENT_ID;

	$effect(() => {
		if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined' && gaId) {
			window.gtag('config', gaId, {
				page_path: page.url.pathname
			});
		}
	});

	onMount(() => {
		void auth.init();

		if (!gaId) return;

		const script = document.createElement('script');
		script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
		script.async = true;
		document.head.appendChild(script);

		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		};
		window.gtag('js', new Date());

		window.gtag('config', gaId);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if auth.loading && !auth.initialized}
	<p>Ładowanie...</p>
{:else}
	{@render children()}
{/if}
