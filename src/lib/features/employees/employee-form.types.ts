export type EmployeeUserMode = 'new' | 'existing'

export type EmployeeFormValue =  {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    position: string;

    userMode: EmployeeUserMode;
    userId: string;

    email: string;
    password: string;

};