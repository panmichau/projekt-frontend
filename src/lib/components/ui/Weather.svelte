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
{/if}
