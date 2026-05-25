import { apiFetch } from './api';

import type {
	EmployeeDTO,
	EmployeeSaveRequest,
	PagedModelEmployeeSummaryDTO
} from './types';

export async function getEmployees(page = 0, size = 10) {
	return apiFetch<PagedModelEmployeeSummaryDTO>('/employee/list', {
		method: 'GET',
		auth: true,
		query: {
			page,
			size
		}
	});
}

export async function getEmployee(employeeId: number) {
	return apiFetch<EmployeeDTO>('/employee', {
		method: 'GET',
		auth: true,
		query: {
			employeeId
		}
	});
}

export async function createEmployee(data: EmployeeSaveRequest) {
	return apiFetch<EmployeeDTO>('/employee', {
		method: 'POST',
		auth: true,
		body: data
	});
}

export async function updateEmployee(employeeId: number, data: EmployeeSaveRequest) {
	return apiFetch<EmployeeDTO>('/employee', {
		method: 'PUT',
		auth: true,
		query: {
			employeeId
		},
		body: data
	});
}

export async function deleteEmployee(employeeId: number) {
	return apiFetch<void>('/employee', {
		method: 'DELETE',
		auth: true,
		query: {
			employeeId
		}
	});
}