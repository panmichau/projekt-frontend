import type { CourseSaveRequest } from '$lib/api/types';
import type { CourseFormValue } from './course-form.types';

export function buildCourseRequest(value: CourseFormValue): CourseSaveRequest {
	return {
		destination: value.destination.trim(),
		date: new Date(value.date).toISOString(),
		description: value.description.trim() || undefined,
		cost: value.cost ? Number(value.cost) : 0,
		driver: value.driver ? Number(value.driver) : undefined,
		version: value.version ? Number(value.version) : 1
	};
}