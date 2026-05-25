import { PUBLIC_API_URL } from '$env/static/public';
import { refreshToken } from './auth';

let accessToken: string | null = null;
let tokenExpiration: Date | null = null;
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function setAccessToken(token: string | null) {
	accessToken = token;
}

export async function getAccessToken() {
	if (tokenExpiration === null || Date.now() > tokenExpiration.getTime() - 60_000) {
		try {
			await refreshToken();
		} catch {
			clearAccessToken();
		}
	}

	return accessToken;
}

export function setExpiration(expiration: string) {
	tokenExpiration = new Date(expiration);
}

export function clearAccessToken() {
	accessToken = null;

	if (refreshTimeoutId) {
		clearTimeout(refreshTimeoutId);
		refreshTimeoutId = null;
	}
}

type ApiOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	query?: Record<string, string | number | boolean | undefined>;
	body?: unknown;
	auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
	const url = new URL(path, PUBLIC_API_URL);

	if (options.query) {
		for (const [key, value] of Object.entries(options.query)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}
	}

	const headers: Record<string, string> = {
		Accept: 'application/json'
	};

	if (options.body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	const token: string | null = await getAccessToken();

	if (options.auth) {
		if (!token) {
			throw new Error('Brak access tokena');
		}

		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		method: options.method ?? 'GET',
		headers,
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
		credentials: 'include'
	});

	if (!response.ok) {
		throw new Error(`API error ${response.status}`);
	}

	const text = await response.text();

	return text ? (JSON.parse(text) as T) : (undefined as T);
}
