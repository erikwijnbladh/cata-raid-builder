<script lang="ts">
	import { getToastStore, Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { wowClasses } from '../data/wowClasses.js';
	import { buffs as importedBuffs } from '../data/buffs.js';
	import { tokens as importedTokens } from '../data/tokens.js';
	import { cooldowns as importedCooldowns } from '../data/cooldowns.js';
	import { debuffs as importedDebuffs } from '../data/debuffs.js';
	import { processItems } from '../utils/utils.js';

	const toastStore = getToastStore();

	let buffs = importedBuffs;
	let tokens = importedTokens;
	let cooldowns = importedCooldowns;
	let debuffs = importedDebuffs;

	const copyRaidSetup = async () => {
		// Check if every classSpec in raidSetup is null
		const allClassSpecsNull = raidSetup.every((player) => player.classSpec === null);

		if (allClassSpecsNull) {
			// Optionally, you can handle the case when all classSpecs are null here.
			const toastSettings: ToastSettings = {
				message: 'Add atleast one character',
				background: 'variant-filled-error',
				hideDismiss: true,
				timeout: 3000
			};
			toastStore.trigger(toastSettings);
			return;
		}

		const raidSetupString = JSON.stringify(raidSetup, null, 2);
		await navigator.clipboard.writeText(raidSetupString);
		const toastSettings: ToastSettings = {
			message: 'Raid setup copied to clipboard!',
			background: 'variant-filled-primary',
			hideDismiss: true,
			timeout: 3000
		};
		toastStore.trigger(toastSettings);
	};

	let combinedOptions = [];
	for (const className in wowClasses) {
		wowClasses[className].specs.forEach((spec) => {
			combinedOptions.push({
				icon: spec.icon,
				label: `${className} - ${spec.name}`
			});
		});
	}

	let raidSetup = Array.from({ length: 10 }, () => ({ name: '', classSpec: null }));

	function clearRaid() {
		importedRaidSetupJson = '';
		raidSetup = raidSetup.map(() => ({ name: '', classSpec: null }));
	}

	function handleNameChange(index, event) {
		raidSetup[index].name = event.target.value;
	}

	$: buffs = processItems(importedBuffs, wowClasses, raidSetup);
	$: debuffs = processItems(importedDebuffs, wowClasses, raidSetup);
	$: cooldowns = processItems(importedCooldowns, wowClasses, raidSetup);
	$: tokens = processItems(importedTokens, wowClasses, raidSetup);

	$: selectedIcons = raidSetup.map((player) => (player.classSpec ? player.classSpec.icon : null));

	let importedRaidSetupJson = '';

	function importRaidSetup() {
		try {
			const importedRaidSetup = JSON.parse(importedRaidSetupJson);
			if (Array.isArray(importedRaidSetup) && importedRaidSetup.length === raidSetup.length) {
				raidSetup = importedRaidSetup.map((player) => {
					const matchingSpec = combinedOptions.find(
						(option) => option.label === player.classSpec?.label
					);
					return { ...player, classSpec: matchingSpec || null };
				});
			} else {
				alert(
					'Invalid raid setup format. Please ensure the imported data matches the expected structure.'
				);
			}
		} catch (error) {
			console.error('Error parsing JSON:', error);
			alert('Invalid JSON format. Please check your data.');
		}
	}
</script>

<div class="flex flex-col md:flex-row mx-4 md:mx-20 justify-between gap-20">
	<div class="w-full">
		<form class="gap-8 grid grid-cols-2">
			{#each raidSetup as player, index}
				<div class="flex flex-col relative gap-1">
					<div class="flex flex-row">
						<input
							type="text"
							class="input w-full md:w-1/2 font-bold"
							placeholder={`Player ${index + 1} name`}
							bind:value={player.name}
							on:input={(e) => handleNameChange(index, e)}
						/>
						<Avatar
							src={selectedIcons[index]}
							alt="Class Icon"
							width="w-10 h-10"
							rounded="rounded-full"
							background="bg-surface-300-600-token"
							class="hidden md:flex ml-1"
							fallback="null"
							initials=""
						/>
					</div>
					<select class="select" bind:value={player.classSpec}>
						<option value={null}>Select Class</option>
						{#each combinedOptions as option}
							<option value={option}>{option.label}</option>
						{/each}
					</select>
				</div>
			{/each}
		</form>
		<div class="flex flex-col md:flex-row">
			<div class="flex flex-col w-full my-4 gap-4">
				<div class="flex flex-row gap-4 border-b pb-4">
					<button on:click={copyRaidSetup} type="button" class="btn variant-filled"
						>Copy Raid</button
					>
					<button on:click={clearRaid} type="button" class="btn variant-filled">Reset Raid</button>
				</div>
				<div class="flex flex-row gap-2">
					<input
						bind:value={importedRaidSetupJson}
						type="text"
						class="input w-1/2 font-bold"
						placeholder="Paste raid data here"
					/>
					<button on:click={importRaidSetup} type="button" class="btn variant-filled"
						>Import Raid</button
					>
				</div>
			</div>

			<div class="flex flex-col gap-4 mt-10 w-full">
				<span class="text-center text-2xl"> Tokens </span>
				<div class="flex flex-row justify-center gap-4 mt-4">
					{#each tokens as token}
						<div>
							{token.name}: {token.count}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="card p-4 w-full flex flex-col justify-between">
		<Accordion>
			<AccordionItem open>
				<svelte:fragment slot="summary">Buffs</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-8 py-4">
						{#each buffs as buff}
							<div title="Providers: {buff.displayText}">
								{#if buff.count == 0}
									<span>⚠️</span>
									{buff.name}: {buff.count}
								{:else}
									<span>&#x1F50D;</span>
									<!-- Magnifying glass icon -->
									{buff.name}: {buff.count}
								{/if}
							</div>
						{/each}
					</div>
				</svelte:fragment>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="summary">Debuffs</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-8 py-4">
						{#each debuffs as debuff}
							<div title="Providers: {debuff.displayText}">
								{#if debuff.count == 0}
									<span>⚠️</span>
									{debuff.name}: {debuff.count}
								{:else}
									<span>&#x1F50D;</span>
									<!-- Magnifying glass icon -->
									{debuff.name}: {debuff.count}
								{/if}
							</div>
						{/each}
					</div>
				</svelte:fragment>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="summary">Raid CDs</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-8 py-4">
						{#each cooldowns as cooldown}
							<div title="Providers: {cooldown.displayText}">
								{#if cooldown.count == 0}
									<span>⚠️</span>
									{cooldown.name}: {cooldown.count}
								{:else}
									<span>&#x1F50D;</span>
									<!-- Magnifying glass icon -->
									{cooldown.name}: {cooldown.count}
								{/if}
							</div>
						{/each}
					</div>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
</div>

<style lang="postcss">
</style>
