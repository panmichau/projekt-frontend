import { createCourse, deleteCourse, getCourse, getCourses, updateCourse } from '$lib/api/courses';
import { getEmployees } from '$lib/api/employees';
import { assignLoadsToCourse, getLoad, getLoads } from '$lib/api/loads';
import type {
	CourseDTO,
	CourseSummaryDTO,
	EmployeeSummaryDTO,
	LoadDTO,
	PageMetadata
} from '$lib/api/types';
import type { CourseFormValue } from './course-form.types';
import { buildCourseRequest } from './course-request';

export class CoursesState {
	courses = $state<CourseSummaryDTO[]>([]);
	employees = $state<EmployeeSummaryDTO[]>([]);
	loads = $state<LoadDTO[]>([]);
	page = $state<PageMetadata | null>(null);

	loading = $state(false);
	saving = $state(false);
	deleting = $state(false);

	error = $state<string | null>(null);
	formError = $state<string | null>(null);

	showForm = $state(false);
	editedCourse = $state<CourseDTO | null>(null);

	async loadCourses(pageNumber = 0) {
		this.loading = true;
		this.error = null;

		try {
			const response = await getCourses(pageNumber, 10);

			this.courses = response.content ?? [];
			this.page = response.page ?? null;
		} catch (error) {
			console.error(error);
			this.error = 'Nie udało się pobrać listy kursów.';
		} finally {
			this.loading = false;
		}
	}

	async loadFormData() {
		this.formError = null;

		try {
			const [employeesResponse, loadsResponse] = await Promise.all([
				getEmployees(0, 25),
				getLoads(0, 25)
			]);

			const loadSummaries = loadsResponse.content ?? [];

			const loadDetails = await Promise.all(
				loadSummaries
					.filter((load) => load.id !== undefined)
					.map((load) => getLoad(load.id!))
			);

			this.employees = employeesResponse.content ?? [];
			this.loads = loadDetails;
		} catch (error) {
			console.error(error);
			this.formError = 'Nie udało się pobrać danych formularza.';
		}
	}

	async startCreate() {
		this.editedCourse = null;
		this.formError = null;
		this.showForm = false;

		await this.loadFormData();

		this.showForm = true;
	}

	async startEdit(course: CourseSummaryDTO) {
		if (!course.id) return;

		this.formError = null;
		this.showForm = false;

		try {
			this.editedCourse = await getCourse(course.id);
			await this.loadFormData();

			this.showForm = true;
		} catch (error) {
			console.error(error);
			this.formError = 'Nie udało się pobrać danych kursu.';
			this.showForm = true;
		}
	}

	cancelForm() {
		this.showForm = false;
		this.editedCourse = null;
		this.formError = null;
	}

	async saveCourse(value: CourseFormValue) {
		this.saving = true;
		this.formError = null;

		try {
			const request = buildCourseRequest(value);

			const savedCourse = this.editedCourse?.id
				? await updateCourse(this.editedCourse.id, request)
				: await createCourse(request);

			if (savedCourse.id && value.loadIds.length > 0) {
				await assignLoadsToCourse(savedCourse.id, value.loadIds);
			}

			await this.loadCourses(this.page?.number ?? 0);
			this.cancelForm();
		} catch (error) {
			console.error(error);
			this.formError = this.editedCourse?.id
				? 'Nie udało się zapisać zmian kursu.'
				: 'Nie udało się dodać kursu.';
		} finally {
			this.saving = false;
		}
	}

	async removeCourse(course: CourseSummaryDTO) {
		if (!course.id) return;

		const confirmed = confirm(
			`Czy na pewno usunąć kurs ${course.destination || `#${course.id}`}?`
		);

		if (!confirmed) return;

		this.deleting = true;
		this.error = null;

		try {
			await deleteCourse(course.id);
			await this.loadCourses(this.page?.number ?? 0);
		} catch (error) {
			console.error(error);
			this.error = 'Nie udało się usunąć kursu.';
		} finally {
			this.deleting = false;
		}
	}
}