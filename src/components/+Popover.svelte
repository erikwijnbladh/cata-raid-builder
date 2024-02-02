<!-- Popover.svelte -->
<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	let isPopoverOpen = false;

	function togglePopover() {
		isPopoverOpen = !isPopoverOpen;
	}

	function closePopover() {
		isPopoverOpen = false;
	}

	const dispatch = createEventDispatcher();

	onMount(() => {
		const handleClickOutside = (event) => {
			if (!event.target.closest('.popover-container')) {
				closePopover();
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative inline-block text-left popover-container">
	<div>
		<button on:click={togglePopover} class="btn-icon btn-icon-sm variant-filled"> ⋮ </button>
	</div>

	{#if isPopoverOpen}
		<div
			class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md card"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none">
				<slot />
				<!-- Slot for popover content -->
			</div>
		</div>
	{/if}
</div>
