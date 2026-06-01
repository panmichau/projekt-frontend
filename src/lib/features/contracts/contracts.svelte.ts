import {
	createContract,
	deleteContract,
	getContract,
	getContracts,
	updateContract
} from '$lib/api/contracts';

import { getClients } from '$lib/api/clients';

import type {
	ClientSummaryDTO,
	ContractDTO,
	ContractSummaryDTO,
	PageMetadata
} from '$lib/api/types';

import type { ContractFormValue } from './contract-form.types';
import { buildContractRequest } from './contract-request';

export class ContractsState {
	contracts = $state<ContractSummaryDTO[]>([]);
	clients = $state<ClientSummaryDTO[]>([]);
	page = $state<PageMetadata | null>(null);
	clientName = $state('');

	loading = $state(false);
	saving = $state(false);
	deleting = $state(false);

	error = $state<string | null>(null);
	formError = $state<string | null>(null);

	showForm = $state(false);
	editedContract = $state<ContractDTO | null>(null);

	async loadContracts(pageNumber = 0) {
		this.loading = true;
		this.error = null;

		try {
			const response = await getContracts(pageNumber, 10, this.clientName);

			this.contracts = response.content ?? [];
			this.page = response.page ?? null;
		} catch (error) {
			console.error(error);
			this.error = 'Nie udało się pobrać listy kontraktów.';
		} finally {
			this.loading = false;
		}
	}

	async loadFormData() {
		this.formError = null;

		try {
			const response = await getClients(0, 10);
			const clients = response.content ?? [];

			const editedClient = this.editedContract?.client;

			if (editedClient?.id && !clients.some((client) => client.id === editedClient.id)) {
				this.clients = [editedClient, ...clients];
			} else {
				this.clients = clients;
			}
		} catch (error) {
			console.error(error);
			this.formError = 'Nie udało się pobrać listy klientów.';
		}
	}

	async startCreate() {
		this.editedContract = null;
		this.formError = null;
		this.showForm = false;

		await this.loadFormData();

		this.showForm = true;
	}

	async startEdit(contract: ContractSummaryDTO) {
		if (!contract.id) return;

		this.formError = null;
		this.showForm = false;

		try {
			this.editedContract = await getContract(contract.id);
			await this.loadFormData();

			this.showForm = true;
		} catch (error) {
			console.error(error);
			this.formError = 'Nie udało się pobrać danych kontraktu.';
			this.showForm = true;
		}
	}

	cancelForm() {
		this.showForm = false;
		this.editedContract = null;
		this.formError = null;
	}

	async saveContract(value: ContractFormValue) {
		this.saving = true;
		this.formError = null;

		try {
			const request = buildContractRequest(value);

			if (this.editedContract?.id) {
				await updateContract(this.editedContract.id, request);
			} else {
				await createContract(request);
			}

			await this.loadContracts(this.page?.number ?? 0);
			this.cancelForm();
		} catch (error) {
			console.error(error);

			this.formError = this.editedContract?.id
				? 'Nie udało się zapisać zmian kontraktu.'
				: 'Nie udało się dodać kontraktu.';
		} finally {
			this.saving = false;
		}
	}

	async removeContract(contract: ContractSummaryDTO) {
		if (!contract.id) return;

		const confirmed = confirm(
			`Czy na pewno usunąć kontrakt ${contract.name || `#${contract.id}`}?`
		);

		if (!confirmed) return;

		this.deleting = true;
		this.error = null;

		try {
			await deleteContract(contract.id);
			await this.loadContracts(this.page?.number ?? 0);
		} catch (error) {
			console.error(error);
			this.error = 'Nie udało się usunąć kontraktu.';
		} finally {
			this.deleting = false;
		}
	}
	async search() {
	await this.loadContracts(0);
}

	async clearFilters() {
	this.clientName = '';

	await this.loadContracts(0);
}

}