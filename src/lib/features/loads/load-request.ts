import type { LoadSaveRequest, SizeEnum, DeliveryStatesEnum } from '$lib/api/types';
import type { LoadFormValue } from './load-form.types';

export function buildLoadRequest(value: LoadFormValue): LoadSaveRequest {
	return {
		identifier: value.identifier.trim(),
		type: value.type.trim(),
		size: value.size as SizeEnum,
		weight: parseFloat(value.weight),
		worth: parseFloat(value.worth),
		contractId: parseInt(value.contractId, 10),
		deliveryState: value.deliveryStateId as DeliveryStatesEnum,
		version: 1
	};
}
