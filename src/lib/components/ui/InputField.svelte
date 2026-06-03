<script lang="ts">
    let {
        label,
        value = $bindable(),
        error = null,
        placeholder = '',
        required = false,
        type = 'text',
        maxlength
        
    }: {
        label: string;
        value: string;
        error?: string | null;
        placeholder?: string;
        required?: boolean;
        type?: string;
        maxlength?: number;
    } = $props();
</script>

<label class="flex flex-col gap-1">
    <span class="text-sm font-medium text-zinc-700">{label}</span>

    <input
        {type}
        class="h-10 border border-zinc-300 px-3 text-sm outline-none focus:border-black disabled:bg-zinc-100"
        bind:value
        {placeholder}
        {required}
        {maxlength}
    />

    {#if error}
        <span class="text-sm text-red-800">{error}</span>
    {/if}
</label>