import { getLoads, getLoad, createLoad, deleteLoad, updateLoad } from '$lib/api/loads';
import type { LoadSummaryDTO, LoadDTO, ContractSummaryDTO, PageMetadata } from '$lib/api/types';
import { buildLoadRequest } from './load-request';
import type { LoadFormValue } from './load-form.types';

export class LoadsState {
	loads = $state<LoadSummaryDTO[]>([]);
	contracts = $state<ContractSummaryDTO[]>([]);
	deliveryStates = $state<Array<{ id: number; name: string }>>([]);
	page = $state<PageMetadata | null>(null);

	loading = $state(false);
	saving = $state(false);
	deleting = $state(false);

	error = $state<string | null>(null);
	formError = $state<string | null>(null);

	showForm = $state(false);
	editedLoad = $state<LoadDTO | null>(null);

	showDetails = $state(false);
	viewedLoad = $state<LoadDTO | null>(null);

	async loadLoads(pageNumber = 0) {
		this.loading = true;
		this.error = null;
		try {
			const response = await getLoads(pageNumber, 10);
			this.loads = response.content ?? [];
			this.page = response.page ?? null;
		} catch {
			this.error = 'Nie udało się pobrać listy ładunków.';
		} finally {
			this.loading = false;
		}
	}

	async loadFormData() {}

	startCreate() {
		this.editedLoad = null;
		this.formError = null;
		this.showForm = true;
	}

	async startEdit(load: LoadSummaryDTO) {
		if (!load.id) return;
		this.formError = null;
		this.showDetails = false;
		try {
			this.editedLoad = await getLoad(load.id);
			this.showForm = true;
		} catch {
			this.formError = 'Nie udało się pobrać danych ładunku.';
			this.showForm = true;
		}
	}

	cancelForm() {
		this.showForm = false;
		this.editedLoad = null;
		this.formError = null;
	}

	async startView(load: LoadSummaryDTO) {
		if (!load.id) return;
		this.error = null;
		this.showForm = false;
		
		try {
			this.viewedLoad = await getLoad(load.id);
			this.showDetails = true;
		} catch {
			this.error = 'Nie udało się pobrać szczegółów ładunku.';
		}
	}

	closeDetails() {
		this.showDetails = false;
		this.viewedLoad = null;
	}

	async saveLoad(value: LoadFormValue) {
		this.saving = true;
		this.formError = null;
		try {
			const request = buildLoadRequest(value);

			if (this.editedLoad?.id) {
				await updateLoad(this.editedLoad.id, request);
				console.warn('Backend nie ma jeszcze endpointu PUT /load');
			} else {
				await createLoad(request);
			}

			await this.loadLoads(this.page?.number ?? 0);
			this.cancelForm();
		} catch {
			this.formError = this.editedLoad?.id
				? 'Nie udało się zapisać zmian ładunku.'
				: 'Nie udało się dodać ładunku.';
		} finally {
			this.saving = false;
		}
	}

	async removeLoad(load: LoadSummaryDTO) {
		if (!load.id) return;
		const confirmed = confirm(`Czy na pewno chcesz usunąć ładunek ${load.identifier || `#${load.id}`}?`);
		if (!confirmed) return;

		this.deleting = true;
		this.error = null;
		try {
			await deleteLoad(load.id);
			await this.loadLoads(this.page?.number ?? 0);

			if (this.viewedLoad?.id === load.id) {
				this.closeDetails();
			}
			
		} catch {
			this.error = 'Nie udało się usunąć ładunku.';
		} finally {
			this.deleting = false;
		}
	}
}