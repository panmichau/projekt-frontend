import {
    createEmployee,
    deleteEmployee,
    getEmployee,
    getEmployees,
    updateEmployee
} from '$lib/api/employees';
import { getPositions } from '$lib/api/positions';
import { getUsers } from '$lib/api/users';
import type {
    EmployeeDTO,
    EmployeeSummaryDTO,
    PageMetadata,
    PositionDTO,
    UserSummaryDTO
} from '$lib/api/types';
import { buildEmployeeRequest } from '$lib/features/employees/employee-request';
import type { EmployeeFormValue } from '$lib/features/employees/employee-form.types';

export class EmployeesState {
    employees = $state<EmployeeSummaryDTO[]>([]);
    positions = $state<PositionDTO[]>([]);
    users = $state<UserSummaryDTO[]>([]);
    assignedUserIds = $state<number[]>([]);
    page = $state<PageMetadata | null>(null);

    loading = $state(false);
    saving = $state(false);
    deleting = $state(false);

    error = $state<string | null>(null);
    formError = $state<string | null>(null);

    showForm = $state(false);
    editedEmployee = $state<EmployeeDTO | null>(null);

    availableUsers = $derived(
        this.users.filter((user) => {
            if (!user.id || !user.email) return false;
            return !this.assignedUserIds.includes(user.id);
        })
    );

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

    async loadAssignedUserIds() {
        const response = await getEmployees(0, 25);
        const employeeSummaries = response.content ?? [];

        const employeeDetails = await Promise.all(
            employeeSummaries
                .filter((employee) => employee.id)
                .map((employee) => getEmployee(employee.id!))
        );

        this.assignedUserIds = employeeDetails
            .map((employee) => employee.user?.id)
            .filter((userId): userId is number => Boolean(userId));
    }

    async loadFormData() {
        try {
            const [positionsResponse, usersResponse] = await Promise.all([
                getPositions(),
                getUsers(0, 25)
            ]);

            this.positions = positionsResponse;
            this.users = usersResponse.content ?? [];

            await this.loadAssignedUserIds();
        } catch {
            this.formError = 'Nie udało się pobrać danych formularza.';
        }
    }

    startCreate() {
        this.editedEmployee = null;
        this.formError = null;
        this.showForm = true;
    }

    async startEdit(employee: EmployeeSummaryDTO) {
        if (!employee.id) return;

        this.formError = null;

        try {
            this.editedEmployee = await getEmployee(employee.id);
            this.showForm = true;
        } catch {
            this.formError = 'Nie udało się pobrać danych pracownika.';
            this.showForm = true;
        }
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

        const confirmed = confirm(
            `Czy na pewno usunąć pracownika ${fullName || `#${employee.id}`}?`
        );

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