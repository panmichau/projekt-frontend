<script lang="ts">
	import type { CurrentWeatherDTO } from '$lib/api/types';
	import { getCurrentWeather } from '$lib/api/weather';

	let weather = $state<CurrentWeatherDTO>({});

	let icon = $state<string | undefined>();
	let description = $state<string | undefined>();
	let temp = $state<number | undefined>();
	let feelsLike = $state<number | undefined>();

	let loading = $state<boolean>(false);
	let visible = $state<boolean>(true);

	init();

	async function init() {
		loading = true;

		await loadWeather();

		icon = weather.current?.weather?.[0]?.icon;
		description = weather.current?.weather?.[0]?.description
			? weather.current.weather[0].description.charAt(0).toUpperCase() +
				weather.current.weather[0].description.slice(1)
			: 'N/A';
		temp = weather.current?.temp
			? Number(Math.round(Number(weather.current?.temp + 'e1')) + 'e-1')
			: 0;
		feelsLike = weather.current?.feels_like
			? Number(Math.round(Number(weather.current?.feels_like + 'e1')) + 'e-1')
			: 0;
	}

	async function loadWeather() {
		if (!loading) return;
		try {
			let location = await getLocation();

			let latitude = location.coords.latitude;
			let longitude = location.coords.longitude;

			weather = await getCurrentWeather(latitude, longitude);
		} catch {
			visible = false;
		} finally {
			loading = false;
		}
	}

	async function getLocation(): Promise<GeolocationPosition> {
		return new Promise((resolve, reject) => {
			if (!('geolocation' in navigator)) {
				reject(new Error('Geolocation not available.'));
				return;
			}
			navigator.geolocation.getCurrentPosition(resolve, reject);
		});
	}
</script>

{#if visible && !loading}
	<div class="flex justify-between">
		<img
			src="https://openweathermap.org/payload/api/media/file/{icon}.png"
			alt="Weather Icon"
			class="w-1/2"
		/>
		<div class="flex flex-col justify-around">
			<div class="w-full text-sm font-bold">{description}</div>
			<div class="w-full text-xs">Temperatura: {temp}°C</div>
			<div class="w-full text-xs">Odczuwalna: {feelsLike}°C</div>
		</div>
	</div>
{:else if visible && loading}
	<div class="flex h-20 items-center justify-center">
		<svg
			class="mr-3 size-12 animate-spin text-gray-500"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			>
				<svg class="mr-3 size-16 animate-spin" viewBox="0 0 24 24"></svg>
			</path>
		</svg>
	</div>
{/if}
