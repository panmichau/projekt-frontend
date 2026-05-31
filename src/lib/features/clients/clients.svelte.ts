import {
	createClient,
	deleteClient,
	getClient,
	getClients,
	updateClient
} from '$lib/api/clients';

import type {
	ClientDTO,
	ClientSummaryDTO,
	PageMetadata
} from '$lib/api/types';

import { buildClientRequest } from '$lib/features/clients/client-request';
import type { ClientFormValue } from '$lib/features/clients/client-form.types';

export class ClientsState {
	clients = $state<ClientSummaryDTO[]>([]);
	page = $state<PageMetadata | null>(null);

	loading = $state(false);
	saving = $state(false);
	deleting = $state(false);

	error = $state<string | null>(null);
	formError = $state<string | null>(null);

	showForm = $state(false);
	editedClient = $state<ClientDTO | null>(null);

	async loadClients(pageNumber = 0) {
		this.loading = true;
		this.error = null;

		try {
			const response = await getClients(pageNumber, 10);

			this.clients = response.content ?? [];
			this.page = response.page ?? null;
		} catch {
			this.error = 'Nie udało się pobrać listy klientów.';
		} finally {
			this.loading = false;
		}
	}

	startCreate() {
		this.editedClient = null;
		this.formError = null;
		this.showForm = true;
	}

	async startEdit(client: ClientSummaryDTO) {
		if (!client.id) return;

		this.formError = null;

		try {
			this.editedClient = await getClient(client.id);
			this.showForm = true;
		} catch {
			this.formError = 'Nie udało się pobrać danych klienta.';
			this.showForm = true;
		}
	}

	cancelForm() {
		this.showForm = false;
		this.editedClient = null;
		this.formError = null;
	}

	async saveClient(value: ClientFormValue) {
		this.saving = true;
		this.formError = null;

		try {
			const request = buildClientRequest(value);

			if (this.editedClient?.id) {
				await updateClient(this.editedClient.id, request);
			} else {
				await createClient(request);
			}

			await this.loadClients(this.page?.number ?? 0);
			this.cancelForm();
		} catch {
			this.formError = this.editedClient?.id
				? 'Nie udało się zapisać zmian klienta.'
				: 'Nie udało się dodać klienta.';
		} finally {
			this.saving = false;
		}
	}

	async removeClient(client: ClientSummaryDTO) {
		if (!client.id) return;

		const confirmed = confirm(
			`Czy na pewno usunąć klienta ${client.name || `#${client.id}`}?`
		);

		if (!confirmed) return;

		this.deleting = true;
		this.error = null;

		try {
			await deleteClient(client.id);
			await this.loadClients(this.page?.number ?? 0);
		} catch {
			this.error = 'Nie udało się usunąć klienta.';
		} finally {
			this.deleting = false;
		}
	}
}