import { apiFetch } from './api';
import type { LoadDTO, LoadSaveRequest, PagedModelLoadSummaryDTO } from './types';

export async function getLoads(page = 0, size = 10) {
	return apiFetch<PagedModelLoadSummaryDTO>('/load/list', {
		method: 'GET',
		auth: true,
		query: { page, size }
	});
}

export async function getLoad(loadId: number) {
	return apiFetch<LoadDTO>('/load', {
		method: 'GET',
		auth: true,
		query: { loadId }
	});
}

export async function createLoad(data: LoadSaveRequest) {
	return apiFetch<LoadDTO>('/load', {
		method: 'POST',
		auth: true,
		body: data
	});
}

export async function deleteLoad(loadId: number) {
	return apiFetch<void>('/load', {
		method: 'DELETE',
		auth: true,
		query: { loadId }
	});
}

export async function assignLoadsToCourse(courseId: number, loadIds: number[]) {
	return apiFetch<void>('/load/assign-to-course', {
		method: 'PATCH',
		auth: true,
		query: { courseId },
		body: loadIds
	});
}