import {
	createEmployee,
	deleteEmployee,
	getEmployee,
	getEmployees,
	updateEmployee
} from '$lib/api/employees';
import { getPositions } from '$lib/api/positions';
import type {
	EmployeeDTO,
	EmployeeSummaryDTO,
	PageMetadata,
	PositionDTO,
	UserSummaryDTO
} from '$lib/api/types';
import { getUnassignedUsers } from '$lib/api/users';
import { buildEmployeeRequest } from '$lib/features/employees/employee-request';
import type { EmployeeFormValue } from '$lib/features/employees/employee-form.types';

export class EmployeesState {
	employees = $state<EmployeeSummaryDTO[]>([]);
	positions = $state<PositionDTO[]>([]);
	users = $state<UserSummaryDTO[]>([]);
	page = $state<PageMetadata | null>(null);

	loading = $state(false);
	saving = $state(false);
	deleting = $state(false);

	error = $state<string | null>(null);
	formError = $state<string | null>(null);

	showForm = $state(false);
	editedEmployee = $state<EmployeeDTO | null>(null);

	showDetails = $state(false);
	viewedEmployee = $state<EmployeeDTO | null>(null);

	async loadEmployees(pageNumber = 0) {
		this.loading = true;
		this.error = null;

		try {
			const response = await getEmployees(pageNumber, 10);
			this.employees = response.content ?? [];
			this.page = response.page ?? null;
		} catch {
			this.error = 'Nie udało się pobrać listy pracowników.';
		} finally {
			this.loading = false;
		}
	}

	async loadFormData() {
		try {
			const [positionsResponse, usersResponse] = await Promise.all([
				getPositions(),
				getUnassignedUsers()
			]);

			this.positions = positionsResponse;
			this.users = usersResponse;
		} catch {
			this.formError = 'Nie udało się pobrać danych formularza.';
		}
	}

	async startCreate() {
		this.editedEmployee = null;
		this.formError = null;
		this.showForm = true;
		this.showDetails = false;

		await this.loadFormData();
	}

	async startEdit(employee: EmployeeSummaryDTO) {
		if (!employee.id) return;

		this.formError = null;
		this.showDetails = false;

		try {
			this.editedEmployee = await getEmployee(employee.id);
			this.showForm = true;

			await this.loadFormData();
		} catch {
			this.formError = 'Nie udało się pobrać danych pracownika.';
			this.showForm = true;
		}
	}

	async startView(employee: EmployeeSummaryDTO) {
		if (!employee.id) return;
		this.error = null;
		this.showForm = false;
		try {
			this.viewedEmployee = await getEmployee(employee.id);
			this.showDetails = true;
		} catch {
			this.error = 'Nie udało się pobrać szczegółów pracownika.';
		}
	}

	closeDetails() {
		this.showDetails = false;
		this.viewedEmployee = null;
	}

	cancelForm() {
		this.showForm = false;
		this.editedEmployee = null;
		this.formError = null;
	}

	async saveEmployee(value: EmployeeFormValue) {
		this.saving = true;
		this.formError = null;

		try {
			const request = buildEmployeeRequest(value, this.editedEmployee);

			if (this.editedEmployee?.id) {
				await updateEmployee(this.editedEmployee.id, request);
			} else {
				await createEmployee(request);
			}

			await Promise.all([this.loadEmployees(this.page?.number ?? 0), this.loadFormData()]);
			this.cancelForm();
		} catch {
			this.formError =
				value.userMode === 'existing'
					? 'Nie udało się przypisać konta. To konto może być już przypisane do innego pracownika.'
					: this.editedEmployee?.id
						? 'Nie udało się zapisać zmian pracownika.'
						: 'Nie udało się dodać pracownika.';
		} finally {
			this.saving = false;
		}
	}

	async removeEmployee(employee: EmployeeSummaryDTO) {
		if (!employee.id) return;

		const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim();

		const confirmed = confirm(`Czy na pewno usunąć pracownika ${fullName || `#${employee.id}`}?`);

		if (!confirmed) return;

		this.deleting = true;
		this.error = null;

		try {
			await deleteEmployee(employee.id);
			await Promise.all([this.loadEmployees(this.page?.number ?? 0), this.loadFormData()]);
		} catch {
			this.error = 'Nie udało się usunąć pracownika.';
		} finally {
			this.deleting = false;
		}
	}
}
