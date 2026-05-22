export type Role = 'NONE' | 'DRIVER' | 'FORWARDER' | 'MANAGER' | 'ADMIN';

export type AppModule = {
	title: string;
	description: string;
	href: string;
	roles: Role[];
};

export const appModules: AppModule[] = [
	{
		title: 'Użytkownicy',
		description: 'Lista użytkowników i zarządzanie rolami.',
		href: '/users',
		roles: ['ADMIN', 'MANAGER']
	},
	{
		title: 'Pracownicy',
		description: 'Zarządzanie pracownikami firmy.',
		href: '/employees',
		roles: ['ADMIN', 'MANAGER']
	},
	{
		title: 'Stanowiska',
		description: 'Zarządzanie stanowiskami pracowników.',
		href: '/positions',
		roles: ['ADMIN', 'MANAGER']
	},
	{
		title: 'Klienci',
		description: 'Lista klientów i dane kontaktowe.',
		href: '/clients',
		roles: ['ADMIN', 'MANAGER', 'FORWARDER']
	},
	{
		title: 'Kontrakty',
		description: 'Obsługa kontraktów klientów.',
		href: '/contracts',
		roles: ['ADMIN', 'MANAGER', 'FORWARDER']
	},
	{
		title: 'Kursy',
		description: 'Planowanie i obsługa kursów.',
		href: '/courses',
		roles: ['ADMIN', 'MANAGER', 'FORWARDER', 'DRIVER']
	},
	{
		title: 'Ładunki',
		description: 'Zarządzanie ładunkami.',
		href: '/loads',
		roles: ['ADMIN', 'MANAGER', 'FORWARDER']
	},
	{
		title: 'Stany dostawy',
		description: 'Podgląd i aktualizacja stanów dostawy.',
		href: '/delivery-states',
		roles: ['ADMIN', 'MANAGER', 'FORWARDER']
	}
];
