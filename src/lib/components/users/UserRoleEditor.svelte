<script lang="ts">
	import type { UserSummaryDTO } from '$lib/api/types';
	import FormSection from '$lib/components/form/FormSection.svelte';
	import FormError from '$lib/components/form/FormError.svelte';
	import FormActions from '$lib/components/form/FormActions.svelte';

	type Role = 'NONE' | 'DRIVER' | 'FORWARDER' | 'MANAGER' | 'ADMIN';

	type Props = {
		user: UserSummaryDTO;
		selectedRoles: Role[];
		saving?: boolean;
		error?: string | null;
		onToggleRole: (role: Role) => void;
		onSave: () => void | Promise<void>;
		onCancel: () => void;
	};

	let {
		user,
		selectedRoles,
		saving = false,
		error = null,
		onToggleRole,
		onSave,
		onCancel
	}: Props = $props();

	const availableRoles: Role[] = ['DRIVER', 'FORWARDER', 'MANAGER'];
</script>

<FormSection title="Edycja ról użytkownika" description={user.email ?? ''}>
	<div class="flex flex-wrap gap-3">
		{#each availableRoles as role (role)}
			<label
				class="inline-flex items-center gap-2 border border-zinc-300 bg-white px-3 py-2 text-sm text-black"
			>
				<input
					type="checkbox"
					checked={selectedRoles.includes(role)}
					onchange={() => onToggleRole(role)}
				/>

				<span>{role}</span>
			</label>
		{/each}
	</div>

	<FormError {error} />

	<form
		class="mt-5"
		onsubmit={(event) => {
			event.preventDefault();
			onSave();
		}}
	>
		<FormActions submitLabel="Zapisz role" savingLabel="Zapisywanie..." {saving} {onCancel} />
	</form>
</FormSection>
