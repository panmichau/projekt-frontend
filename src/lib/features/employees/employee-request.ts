import type { EmployeeDTO, EmployeeSaveRequest } from '$lib/api/types';
import type { EmployeeFormValue } from '$lib/features/employees/employee-form.types';

export function buildEmployeeRequest(
	value: EmployeeFormValue,
	editedEmployee: EmployeeDTO | null
): EmployeeSaveRequest {
	const baseEmployee: Omit<EmployeeSaveRequest, 'user'> = {
		firstName: value.firstName.trim(),
		lastName: value.lastName.trim(),
		phoneNumber: value.phoneNumber.trim(),
		position: Number(value.position)
	};

	const currentUser = editedEmployee?.user;

	if (editedEmployee?.id && currentUser?.id) {
		return {
			...baseEmployee,
			user: {
				id: currentUser.id,
				email: currentUser.email,
				roles: currentUser.roles
			}
		};
	}

	if (value.userMode === 'none') {
		return baseEmployee;
	}

	if (value.userMode === 'existing') {
		return {
			...baseEmployee,
			user: {
				id: Number(value.userId)
			}
		};
	}

	if (value.userMode === 'new') {
		return {
			...baseEmployee,
			user: {
				email: value.email.trim(),
				password: value.password,
				roles: ['NONE']
			}
		};
	}

	return baseEmployee;
}
