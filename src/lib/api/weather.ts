import { apiFetch } from './api';

import type { CurrentWeatherDTO } from './types';

export async function getCurrentWeather(lat: number, lon: number) {
	return apiFetch<CurrentWeatherDTO>('/weather/current', {
		method: 'GET',
		auth: true,
		query: {
			lat,
			lon
		}
	});
}
