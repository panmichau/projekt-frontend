<script lang="ts">
	import { untrack } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	import type { CourseDTO, EmployeeSummaryDTO, LoadDTO } from '$lib/api/types';
	import type { CourseFormValue } from '$lib/features/courses/course-form.types';

	import CourseLoadsField from '$lib/components/courses/CourseLoadField.svelte';
	import FormActions from '$lib/components/form/FormActions.svelte';
	import FormError from '$lib/components/form/FormError.svelte';
	import FormSection from '$lib/components/form/FormSection.svelte';
	import SelectField from '$lib/components/form/SelectField.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';

	type Props = {
		course?: CourseDTO | null;
		employees: EmployeeSummaryDTO[];
		loads: LoadDTO[];
		error?: string | null;
		saving?: boolean;
		onSubmit: (value: CourseFormValue) => void | Promise<void>;
		onCancel: () => void;
	};

	let {
		course = null,
		employees,
		loads,
		error = null,
		saving = false,
		onSubmit,
		onCancel
	}: Props = $props();

	const isEdit = $derived(Boolean(course?.id));

	yup.setLocale({
		mixed: {
			default: 'Nieprawidłowa wartość',
			required: 'To pole nie może być puste'
		},
		string: {
			max: 'To pole może mieć maksymalnie ${max} znaków'
		},
		number: {
			min: 'Wartość nie może być mniejsza niż ${min}'
		}
	});

	const validationSchema = yup.object({
		destination: yup.string().required().max(255),
		date: yup.string().required(),
		description: yup.string().max(1000),
		cost: yup
			.number()
			.transform((value, originalValue) => (originalValue === '' ? 0 : value))
			.typeError('Wpisz poprawną liczbę')
			.min(0)
			.required(),
		driver: yup.string(),
		version: yup.string().required()
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: {
			destination: untrack(() => course?.destination ?? ''),
			date: untrack(() => (course?.date ? course.date.slice(0, 16) : '')),
			description: untrack(() => course?.description ?? ''),
			cost: untrack(() => (course?.cost != null ? String(course.cost) : '')),
			driver: untrack(() => (course?.driver?.id ? String(course.driver.id) : '')),
			version: untrack(() => (course?.version != null ? String(course.version) : '1')),
			loadIds: untrack(
				() => course?.loads?.map((load) => load.id).filter((id): id is number => Boolean(id)) ?? []
			)
		},
		validationSchema,
		onSubmit: async (values) => {
			await onSubmit({
				destination: values.destination,
				date: values.date,
				description: values.description,
				cost: values.cost,
				driver: values.driver,
				version: values.version,
				loadIds: values.loadIds
			});
		}
	});

	const driverOptions = $derived(
		employees
			.filter((employee) => employee.id !== undefined && employee.position === 'Kierowca')
			.map((employee) => ({
				value: String(employee.id),
				label: `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim()
			}))
	);

	function isAssignedToAnotherCourse(load: LoadDTO) {
		return Boolean(load.courseId && load.courseId !== course?.id);
	}

	function toggleLoad(loadId: number) {
		const load = loads.find((item) => item.id === loadId);

		if (load && isAssignedToAnotherCourse(load) && !$form.loadIds.includes(loadId)) {
			const confirmed = confirm(
				`Ten ładunek jest już przypisany do kursu #${load.courseId}. Czy na pewno chcesz przypisać go do tego kursu?`
			);

			if (!confirmed) return;
		}

		if ($form.loadIds.includes(loadId)) {
			$form.loadIds = $form.loadIds.filter((id) => id !== loadId);
			return;
		}

		$form.loadIds = [...$form.loadIds, loadId];
	}
</script>

<FormSection
	title={isEdit ? 'Edycja kursu' : 'Nowy kurs'}
	description={isEdit
		? 'Edytujesz dane kursu i przypisane ładunki.'
		: 'Dodaj nowy kurs i przypisz do niego ładunki.'}
>
	<FormError {error} />

	<form class="grid gap-4 md:grid-cols-2" onsubmit={handleSubmit} novalidate>
		<InputField
			label="Miejsce docelowe"
			bind:value={$form.destination}
			error={$errors.destination}
			required
		/>

		<InputField
			label="Data kursu"
			type="datetime-local"
			bind:value={$form.date}
			error={$errors.date}
			required
		/>

		<InputField label="Koszt" type="number" bind:value={$form.cost} error={$errors.cost} required />

		<SelectField
			label="Kierowca"
			bind:value={$form.driver}
			error={$errors.driver}
			options={driverOptions}
			placeholder="Wybierz kierowcę"
		/>

		<div class="md:col-span-2">
			<InputField label="Opis" bind:value={$form.description} error={$errors.description} />
		</div>

		<CourseLoadsField
			{loads}
			selectedLoadIds={$form.loadIds}
			currentCourseId={course?.id ?? null}
			onToggle={toggleLoad}
		/>

		<input type="hidden" bind:value={$form.version} />

		<div class="md:col-span-2">
			<FormActions
				submitLabel={isEdit ? 'Zapisz zmiany' : 'Dodaj kurs'}
				savingLabel="Zapisywanie..."
				{saving}
				{onCancel}
			/>
		</div>
	</form>
</FormSection>
