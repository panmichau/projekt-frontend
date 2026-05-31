import type { ClientSaveRequest } from '$lib/api/types';
import type { ClientFormValue } from './client-form.types';

export function buildClientRequest(value: ClientFormValue): ClientSaveRequest {
	const request: ClientSaveRequest = {
		name: value.name.trim(),
		nip: value.nip.trim(),
		phoneNumber: value.phoneNumber.trim()
	};

	const email = value.email.trim();

	if (email) {
		request.email = email;
	}

	return request;
}