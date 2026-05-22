import { PUBLIC_API_URL } from '$env/static/public';

let accessToken: string | null = null;
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function setAccessToken(token: string | null) {
	accessToken = token;
}

export function getAccessToken() {
	return accessToken;
}

export function clearAccessToken() {
	accessToken = null;

	if (refreshTimeoutId) {
		clearTimeout(refreshTimeoutId);
		refreshTimeoutId = null;
	}
}

export function scheduleTokenRefresh(expiration: string, refreshCallback: () => Promise<void>) {
	if (refreshTimeoutId) {
		clearTimeout(refreshTimeoutId);
	}

	const expirationTime = new Date(expiration).getTime();

	if (Number.isNaN(expirationTime)) {
		throw new Error('Nieprawidłowa data wygaśnięcia tokena');
	}

	const oneMinuteBeforeExpiration = expirationTime - Date.now() - 60_000;

	if (oneMinuteBeforeExpiration <= 0) {
		void refreshCallback();
		return;
	}

	refreshTimeoutId = setTimeout(() => {
		void refreshCallback();
	}, oneMinuteBeforeExpiration);
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

	if (options.auth) {
		if (!accessToken) {
			throw new Error('Brak access tokena');
		}

		headers.Authorization = `Bearer ${accessToken}`;
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
