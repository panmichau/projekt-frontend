import { apiFetch } from './api';

import type {
	ClientDTO,
	ClientSaveRequest,
	PagedModelClientSummaryDTO
} from './types';

export async function getClients(page = 0, size = 10) {
	return apiFetch<PagedModelClientSummaryDTO>('/client/list', {
		method: 'GET',
		auth: true,
		query: {
			page,
			size
		}
	});
}

export async function getClient(clientId: number) {
	return apiFetch<ClientDTO>('/client', {
		method: 'GET',
		auth: true,
		query: {
			clientId
		}
	});
}

export async function createClient(data: ClientSaveRequest) {
	return apiFetch<ClientDTO>('/client', {
		method: 'POST',
		auth: true,
		body: data
	});
}

export async function updateClient(clientId: number, data: ClientSaveRequest) {
	return apiFetch<ClientDTO>('/client', {
		method: 'PUT',
		auth: true,
		query: {
			clientId
		},
		body: data
	});
}

export async function deleteClient(clientId: number) {
	return apiFetch<void>('/client', {
		method: 'DELETE',
		auth: true,
		query: {
			clientId
		}
	});
}