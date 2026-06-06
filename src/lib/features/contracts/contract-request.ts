import type { ContractSaveRequest } from '$lib/api/types';

import type { ContractFormValue } from './contract-form.types';

function buildAddress(street: string, postalCode: string, city: string) {
	return `${street.trim()}, ${postalCode.trim()} ${city.trim()}`;
}

export function buildContractRequest(value: ContractFormValue): ContractSaveRequest {
	return {
		name: value.name.trim(),
		clientId: Number(value.clientId),
		senderAddress: buildAddress(value.senderStreet, value.senderPostalCode, value.senderCity),
		deliveryAddress: buildAddress(
			value.deliveryStreet,
			value.deliveryPostalCode,
			value.deliveryCity
		)
	};
}
