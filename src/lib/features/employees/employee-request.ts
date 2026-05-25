import type { EmployeeDTO, EmployeeSaveRequest } from '$lib/api/types';
import type { EmployeeFormValue } from './employee-form.types';

export function buildEmployeeRequest(
	value: EmployeeFormValue,
	editedEmployee: EmployeeDTO | null
): EmployeeSaveRequest {
	const baseEmployee = {
		firstName: value.firstName.trim(),
		lastName: value.lastName.trim(),
		phoneNumber: value.phoneNumber.trim() || undefined,
		position: Number(value.position)
	};

	if (editedEmployee) {
		const user: NonNullable<EmployeeSaveRequest['user']> = {
			id: editedEmployee.user?.id,
			email: value.email.trim(),
			roles: editedEmployee.user?.roles ?? ['NONE']
		};

		if (value.password.trim()) {
			user.password = value.password;
		}

		return {
			...baseEmployee,
			user
		};
	}

	if (value.userMode === 'existing') {
		return {
			...baseEmployee,
			user: {
				id: Number(value.userId)
			}
		};
	}

	return {
		...baseEmployee,
		user: {
			email: value.email.trim(),
			password: value.password,
			roles: ['NONE']
		}
	};
}
            
    