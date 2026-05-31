<script lang="ts">
	import type { ClientDTO } from '$lib/api/types';
	import type { ClientFormValue } from '$lib/features/clients/client-form.types';

	type Props = {
		client: ClientDTO | null;
		saving?: boolean;
		error?: string | null;
		onSubmit: (value: ClientFormValue) => void;
		onCancel: () => void;
	};

	let {
		client,
		saving = false,
		error = null,
		onSubmit,
		onCancel
	}: Props = $props();

	let name = $state('');
	let nip = $state('');
	let phoneNumber = $state('');
	let email = $state('');

	$effect(() => {
		name = client?.name ?? '';
		nip = client?.nip ?? '';
		phoneNumber = client?.phoneNumber ?? '';
		email = client?.email ?? '';
	});

	function submit(event: SubmitEvent) {
		event.preventDefault();

		onSubmit({
			name,
			nip,
			phoneNumber,
			email
		});
	}
</script>

<section class="mb-6 border border-zinc-300 bg-white p-5">
	<div class="mb-4 border-b border-zinc-200 pb-4">
		<h2 class="text-base font-semibold text-black">
			{client?.id ? 'Edycja klienta' : 'Nowy klient'}
		</h2>

		<p class="text-sm text-zinc-600">
			{client?.id ? 'Edytujesz dane klienta.' : 'Dodaj nowego klienta do systemu.'}
		</p>
	</div>

	{#if error}
		<p class="mb-4 border border-red-300 bg-red-50 p-3 text-sm text-red-700">
			{error}
		</p>
	{/if}

	<form class="space-y-4" onsubmit={submit}>
		<div class="grid gap-4 md:grid-cols-2">
			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">Nazwa</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					bind:value={name}
					maxlength="100"
					required
				/>
			</label>

			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">NIP</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					bind:value={nip}
					maxlength="10"
					required
				/>
			</label>

			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">Telefon</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					bind:value={phoneNumber}
					maxlength="12"
					required
				/>
			</label>

			<label class="space-y-1">
				<span class="text-sm font-medium text-zinc-700">Email (opcjonalnie)</span>
				<input
					class="w-full border border-zinc-300 px-3 py-2 text-sm"
					type="email"
					bind:value={email}
					maxlength="255"
				/>
			</label>
		</div>

		<div class="flex gap-2">
			<button
				class="border border-black bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
				type="submit"
				disabled={saving}
			>
				{saving ? 'Zapisywanie...' : client?.id ? 'Zapisz zmiany' : 'Dodaj klienta'}
			</button>

			<button
				class="border border-zinc-300 px-4 py-2 text-sm font-medium"
				type="button"
				onclick={onCancel}
				disabled={saving}
			>
				Anuluj
			</button>
		</div>
	</form>
</section>