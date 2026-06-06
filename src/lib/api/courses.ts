import { apiFetch } from './api';
import type { CourseDTO, CourseSaveRequest, PagedModelCourseSummaryDTO } from './types';

export async function getCourses(page = 0, size = 10): Promise<PagedModelCourseSummaryDTO> {
	return apiFetch('/course/list', {
		method: 'GET',
		auth: true,
		query: { page, size }
	});
}

export async function getCourse(courseId: number): Promise<CourseDTO> {
	return apiFetch('/course', {
		method: 'GET',
		auth: true,
		query: { courseId }
	});
}

export async function createCourse(data: CourseSaveRequest): Promise<CourseDTO> {
	return apiFetch('/course', {
		method: 'POST',
		auth: true,
		body: data
	});
}

export async function updateCourse(courseId: number, data: CourseSaveRequest): Promise<CourseDTO> {
	return apiFetch('/course', {
		method: 'PUT',
		auth: true,
		query: { courseId },
		body: data
	});
}

export async function deleteCourse(courseId: number): Promise<void> {
	return apiFetch('/course', {
		method: 'DELETE',
		auth: true,
		query: { courseId }
	});
}
