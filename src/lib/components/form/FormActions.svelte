<script lang="ts">
	type Props = {
		submitLabel: string;
		savingLabel?: string;
		saving?: boolean;
		onCancel: () => void;
	};

	let {
		submitLabel,
		savingLabel = 'Zapisywanie...',
		saving = false,
		onCancel
	}: Props = $props();
</script>

<div class="flex gap-3">
	<button
		type="submit"
		class="h-10 border border-black bg-black px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
		disabled={saving}
	>
		{saving ? savingLabel : submitLabel}
	</button>

	<button
		type="button"
		class="h-10 border border-zinc-300 bg-white px-4 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
		onclick={onCancel}
		disabled={saving}
	>
		Anuluj
	</button>
</div>