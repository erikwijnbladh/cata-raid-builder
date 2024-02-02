<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let options: Array<{ icon: string; character: string }> = [];
	export let value = null;
	export let isOpen = false; // Now controlled externally
	let selectButton; // Reference to the button element
	let dropdownPosition = 'below'; // Default dropdown position

	const dispatch = createEventDispatcher();

	function selectOption(option) {
		value = option;
		dispatch('toggle', { value: option });
	}

	function toggleDropdown() {
		dispatch('toggle');
		if (!isOpen) {
			updateDropdownPosition();
		}
	}

	// Function to update the dropdown's position based on available viewport space
	function updateDropdownPosition() {
		const rect = selectButton.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const dropdownHeight = 220; // Estimate or dynamically calculate the height of your dropdown

		if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
			dropdownPosition = 'above';
		} else {
			dropdownPosition = 'below';
		}
	}

	onMount(() => {
		window.addEventListener('resize', updateDropdownPosition);
		return () => window.removeEventListener('resize', updateDropdownPosition);
	});
</script>

<div class="select-none">
	<button
		class="cursor-pointer bg-surface-300-600-token rounded-full"
		bind:this={selectButton}
		on:click={toggleDropdown}
	>
		<div class="flex flex-row p-0.5 md:p-1 md:gap-2">
			{#if value}
				<Avatar
					src={value.icon}
					alt="Class Icon"
					width="w-8"
					rounded="rounded-full"
					background="bg-surface-300-600-token"
					class="md:flex my-auto"
					fallback="null"
					initials=""
				/>
			{:else}
				<Avatar
					src="https://icons.veryicon.com/png/o/game/game-entertainment-related-series/world-of-warcraft-1.png"
					alt="Class Icon"
					width="w-8"
					rounded="rounded-full"
					background="bg-surface-300-600-token"
					class="md:flex my-auto opacity-50"
					fallback="null"
					initials=""
				/>
			{/if}
			<div class="my-auto hidden md:flex">
				{#if isOpen}
					<svg class="w-5 h-5 my-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"
						></path></svg
					>
				{:else}
					<svg class="w-5 h-5 my-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						></path></svg
					>
				{/if}
			</div>
		</div>
	</button>
	{#if isOpen}
		<div
			class={`card absolute max-h-48 overflow-y-auto hide-scrollbar z-50 w-full p-2 space-y-1 mt-1 ${dropdownPosition === 'above' ? 'bottom-full' : ''}`}
		>
			{#each options as option}
				<button
					class="flex flex-row gap-2 w-full rounded-lg p-2 cursor-pointer hover:bg-surface-300-600-token"
					on:click={() => selectOption(option)}
				>
					<Avatar
						src={option.icon}
						alt="Class Icon"
						width="w-6"
						rounded="rounded-full"
						background="bg-surface-300-600-token"
						class="hidden md:flex my-auto"
						fallback="null"
						initials=""
					/>
					<p class="my-auto text-left">
						{option.character}
					</p>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.bottom-full {
		bottom: 100%; /* Positions the dropdown above the select button */
		top: auto; /* Resets any top positioning if applied */
	}
</style>
