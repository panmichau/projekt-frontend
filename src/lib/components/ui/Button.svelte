<script lang="ts">
  type Props = {
    type?: 'button' | 'submit';
    disabled?: boolean;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary';
    children: import('svelte').Snippet;
  };

  let {
    type = 'button',
    disabled = false,
    fullWidth = false,
    variant = 'secondary',
    children
  }: Props = $props();

  const classes = $derived([
    'inline-flex h-10 items-center justify-center border px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50',
    fullWidth ? 'w-full' : '',
    variant === 'primary'
      ? 'border-black bg-black text-white hover:bg-zinc-800'
      : 'border-zinc-300 bg-white text-black hover:bg-zinc-100'
  ].join(' '));
</script>

<button {type} {disabled} class={classes}>
  {@render children()}
</button>