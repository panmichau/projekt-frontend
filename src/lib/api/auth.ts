import { apiFetch, clearAccessToken, setAccessToken, setExpiration } from './api';

import type { JwtResponse, LoginRequest, UserRegisterRequest, UserSummaryDTO } from './types';

import { PUBLIC_API_URL } from '$env/static/public';

function applyToken(response: JwtResponse) {
	if (!response.token || !response.expiration) {
		throw new Error('Backend nie zwrócił tokena albo daty wygaśnięcia');
	}

	setAccessToken(response.token);
	setExpiration(response.expiration);
}

export async function register(data: UserRegisterRequest) {
	return apiFetch<UserSummaryDTO>('/auth/register', {
		method: 'POST',
		body: data
	});
}

export async function login(data: LoginRequest) {
	const response = await apiFetch<JwtResponse>('/auth/login', {
		method: 'POST',
		body: data
	});

	applyToken(response);

	return response;
}

export async function refreshToken() {
	const response = await fetch(`${PUBLIC_API_URL}/auth/refresh`, {
		method: 'POST',
		credentials: 'include'
	});

	if (!response.ok) {
		throw new Error(`API error ${response.status}`);
	}

	const text = await response.text();

	applyToken(text ? JSON.parse(text) : undefined);

	return response;
}

export async function getMe() {
	return apiFetch<UserSummaryDTO>('/auth/me', {
		auth: true
	});
}

export async function logout() {
	try {
		await apiFetch<void>('/auth/logout', {
			method: 'POST',
			auth: true
		});
	} finally {
		clearAccessToken();
	}
}
