import { apiFetch } from './api';

import type {
	ContractDTO,
	ContractSaveRequest,
	PagedModelContractSummaryDTO
} from './types';

export async function getContracts(page = 0, size = 10, clientName = '', city = '') {
	return apiFetch<PagedModelContractSummaryDTO>('/contract/list', {
		method: 'GET',
		auth: true,
		query: {
			page,
			size,
			clientName: clientName || undefined,
			city: city || undefined
		}
	});
}

export async function getContract(contractId: number) {
	return apiFetch<ContractDTO>('/contract', {
		method: 'GET',
		auth: true,
		query: {
			contractId
		}
	});
}

export async function createContract(data: ContractSaveRequest) {
	return apiFetch<ContractDTO>('/contract', {
		method: 'POST',
		auth: true,
		body: data
	});
}

export async function updateContract(contractId: number, data: ContractSaveRequest) {
	return apiFetch<ContractDTO>('/contract', {
		method: 'PUT',
		auth: true,
		query: {
			contractId
		},
		body: data
	});
}

export async function deleteContract(contractId: number) {
	return apiFetch<void>('/contract', {
		method: 'DELETE',
		auth: true,
		query: {
			contractId
		}
	});
}