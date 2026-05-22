import {
  apiFetch,
  clearAccessToken,
  scheduleTokenRefresh,
  setAccessToken
} from './api';

import type {
  JwtResponse,
  LoginRequest,
  UserRegisterRequest,
  UserSummaryDTO
} from './types';

function applyToken(response: JwtResponse) {
  if (!response.token || !response.expiration) {
    throw new Error('Backend nie zwrócił tokena albo daty wygaśnięcia');
  }

  setAccessToken(response.token);

  scheduleTokenRefresh(response.expiration, async () => {
    try {
      await refreshToken();
    } catch {
      clearAccessToken();
      window.location.href = '/login';
    }
  });
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
  const response = await apiFetch<JwtResponse>('/auth/refresh', {
    method: 'POST'
  });

  applyToken(response);

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
      method: 'POST'
    });
  } finally {
    clearAccessToken();
  }
}