<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import { register } from '$lib/api/auth';

	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	yup.setLocale({
		mixed: {
			default: 'Nieprawidłowa wartość',
			required: 'To pole nie może być puste'
		},
		string: {
			email: 'Nieprawidłowy email'
		}
	});

	const schema = yup.object({
		email: yup.string().email().required(),
		password: yup
			.string()
			.min(8, 'Hasło musi mieć co najmniej 8 znaków')
			.max(255, 'Hasło może mieć maksymalnie 255 znaków')
			.required(),
		repeatedPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Hasła nie są takie same')
			.required()
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: { email: '', password: '', repeatedPassword: '' },
		validationSchema: schema,
		onSubmit: async (values) => {
			error = null;
			loading = true;

			try {
				const email = values.email;
				const password = values.password;

				await register({ email, password });
				await goto(resolve('/login'));
			} catch {
				error = 'Nie udało się utworzyć konta.';
			} finally {
				loading = false;
			}
		}
	});

	let error = $state<string | null>(null);
	let loading = $state(false);
</script>

<svelte:head>
	<title>Rejestracja</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-8 border-b border-zinc-200 pb-6">
			<h1 class="text-2xl font-semibold tracking-tight text-black">Rejestracja</h1>

			<p class="mt-1 text-sm text-zinc-600">Utwórz konto użytkownika.</p>
		</div>

		<form class="space-y-5" onsubmit={handleSubmit} novalidate>
			<TextInput
				label="Email"
				type="email"
				bind:value={$form.email}
				error={$errors.email}
				autocomplete="email"
				required
			/>

			<TextInput
				label="Hasło"
				type="password"
				bind:value={$form.password}
				error={$errors.password}
				autocomplete="new-password"
				required
			/>

			<TextInput
				label="Powtórz hasło"
				type="password"
				bind:value={$form.repeatedPassword}
				error={$errors.repeatedPassword}
				autocomplete="new-password"
				required
			/>

			{#if error}
				<div class="border border-zinc-300 bg-white p-3">
					<p class="text-sm font-medium text-black">{error}</p>
				</div>
			{/if}

			<Button type="submit" variant="primary" fullWidth disabled={loading}>
				{loading ? 'Tworzenie konta...' : 'Zarejestruj'}
			</Button>

			<p class="text-center text-sm text-zinc-600">
				Masz już konto?
				<a class="font-medium text-black underline" href={resolve('/login')}> Zaloguj się </a>
			</p>
		</form>
	</div>
</div>
