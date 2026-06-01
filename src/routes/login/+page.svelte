<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { login } from '$lib/api/auth';
	import { auth } from '$lib/auth/auth.svelte';

	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';

	yup.setLocale({
		mixed: {
			default: 'Nieprawidłowa wartość',
			required: 'To pole nie może być puste'
		}
	});

	const schema = yup.object({
		email: yup.string().required(),
		password: yup.string().required()
	});

	const { form, errors, handleSubmit } = createForm({
		initialValues: { email: '', password: '' },
		validationSchema: schema,
		onSubmit: async (values) => {
			error = null;
			loading = true;

			try {
				const email = values.email;
				const password = values.password;

				await login({ email, password });
				await auth.loadUser();
				await goto(resolve('/dashboard'), { replaceState: true });
			} catch {
				error = 'Nie udało się zalogować. Sprawdź email i hasło.';
			} finally {
				loading = false;
			}
		}
	});

	let error = $state<string | null>(null);
	let loading = $state(false);
</script>

<svelte:head>
	<title>Logowanie</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-8 border-b border-zinc-200 pb-6">
			<h1 class="text-2xl font-semibold tracking-tight text-black">Logowanie</h1>
			<p class="mt-1 text-sm text-zinc-600">Zaloguj się, aby przejść do panelu.</p>
		</div>

		<form class="space-y-5" onsubmit={handleSubmit} novalidate>
			<TextInput
				label="Email"
				type="email"
				bind:value={$form.email}
				autocomplete="email"
				required
				error={$errors.email}
			/>

			<TextInput
				label="Hasło"
				type="password"
				bind:value={$form.password}
				autocomplete="current-password"
				required
				error={$errors.password}
			/>

			{#if error}
				<div class="border border-zinc-300 bg-white p-3">
					<p class="text-sm font-medium text-black">{error}</p>
				</div>
			{/if}

			<Button type="submit" variant="primary" fullWidth disabled={loading}>
				{loading ? 'Logowanie...' : 'Zaloguj'}
			</Button>

			<p class="text-center text-sm text-zinc-600">
				Nie masz konta?
				<a class="font-medium text-black underline" href={resolve('/register')}>
					Zarejestruj się
				</a>
			</p>
		</form>
	</div>
</div>
