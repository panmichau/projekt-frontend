import type { SizeEnum } from '$lib/api/types';

export type LoadFormValue = {
	identifier: string;
	type: string;
	size: SizeEnum | '';
	weight: string;
	worth: string;
	contractId: string;
	deliveryStateId: string;
};
