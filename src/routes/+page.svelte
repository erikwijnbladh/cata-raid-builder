<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { wowClasses } from '../data/wowClasses.js';
	import { buffs as importedBuffs } from '../data/buffs.js';
	import { tokens as importedTokens } from '../data/tokens.js';
	import { cooldowns as importedCooldowns } from '../data/cooldowns.js';
	import { debuffs as importedDebuffs } from '../data/debuffs.js';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { processItems } from '../utils/utils.js';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

	let buffs = importedBuffs;
	let tokens = importedTokens;
	let cooldowns = importedCooldowns;
	let debuffs = importedDebuffs;

	const copyRaidSetup = async () => {
		const raidSetupString = JSON.stringify(raidSetup, null, 2); // Pretty print the JSON
		await navigator.clipboard.writeText(raidSetupString);
		const t: ToastSettings = {
			message: 'Raid setup copied to clipboard!',
			background: 'variant-filled-primary'
		};
		toastStore.trigger(t);
	};

	let combinedOptions = [];
	for (const wowClass in wowClasses) {
		wowClasses[wowClass].forEach((specObj) => {
			combinedOptions.push({
				icon: `${specObj.icon}`,
				label: `${wowClass} - ${specObj.name}`
			});
		});
	}

	let raidSetup = Array.from({ length: 10 }, () => ({ name: '', classSpec: null }));

	function clearRaid() {
		raidSetup = raidSetup.map(() => ({ name: '', classSpec: null }));
	}

	function handleNameChange(index, event) {
		raidSetup[index].name = event.target.value;
	}

	$: {
		buffs = processItems(importedBuffs, wowClasses).map((buff) => {
			const count = raidSetup.reduce((count, player) => {
				return (
					count + (player.classSpec && buff.providers.includes(player.classSpec.label) ? 1 : 0)
				);
			}, 0);
			return { ...buff, count };
		});
	}

	$: {
		debuffs = processItems(importedDebuffs, wowClasses).map((debuff) => {
			const count = raidSetup.reduce((count, player) => {
				return (
					count + (player.classSpec && debuff.providers.includes(player.classSpec.label) ? 1 : 0)
				);
			}, 0);
			return { ...debuff, count };
		});
	}

	$: {
		cooldowns = processItems(importedCooldowns, wowClasses).map((cooldown) => {
			const count = raidSetup.reduce((count, player) => {
				return (
					count + (player.classSpec && cooldown.providers.includes(player.classSpec.label) ? 1 : 0)
				);
			}, 0);
			return { ...cooldown, count };
		});
	}

	$: {
		tokens = tokens.map((token) => {
			const count = raidSetup.reduce((count, player) => {
				return (
					count + (player.classSpec && token.providers.includes(player.classSpec.label) ? 1 : 0)
				);
			}, 0);
			return { ...token, count };
		});
	}
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
					return {
						...player,
						classSpec: matchingSpec || null
					};
				});
			} else {
				alert('Invalid raid setup format');
			}
		} catch (error) {
			console.error('Error parsing JSON:', error);
			alert('Invalid JSON format');
		}
	}
</script>

<div class="flex flex-row mx-20 justify-between gap-20">
	<div class="w-full">
		<form class="gap-8 grid grid-cols-2">
			{#each raidSetup as player, index}
				<div class="flex flex-col relative gap-1">
					<div class="flex flex-row">
						<input
							type="text"
							class="input w-1/2 font-bold"
							placeholder={`Player ${index + 1} name`}
							bind:value={player.name}
							on:input={(e) => handleNameChange(index, e)}
						/>
						{#if selectedIcons[index]}
							<Avatar
								src={selectedIcons[index]}
								alt="Class Icon"
								width="w-11"
								rounded="rounded-full"
								class="ml-1 border-2 border-surface-500 overflow-hidden"
							/>
						{/if}
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
		<div class="flex flex-row">
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
							{#if token.count == 0}
								<span class="text-red-400">
									{token.name}: {token.count}
								</span>
							{:else}
								{token.name}: {token.count}
							{/if}
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
					<div class="grid grid-cols-3 gap-8 py-4">
						{#each buffs as buff}
							<div title="Providers: {buff.displayText}">
								<span>&#x1F50D;</span>
								<!-- Magnifying glass icon -->
								{#if buff.count == 0}
									<span class="text-red-400">{buff.name}: {buff.count}</span>
								{:else}
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
					<div class="grid grid-cols-3 gap-8 py-4">
						{#each debuffs as debuff}
							<div title="Providers: {debuff.displayText}">
								<span>&#x1F50D;</span>
								<!-- Magnifying glass icon -->
								{#if debuff.count == 0}
									<span class="text-red-400">{debuff.name}: {debuff.count}</span>
								{:else}
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
					<div class="grid grid-cols-3 gap-8 py-4">
						{#each cooldowns as cooldown}
							<div title="Providers: {cooldown.displayText}">
								<span>&#x1F50D;</span>
								<!-- Magnifying glass icon -->
								{#if cooldown.count == 0}
									<span class="text-red-400">{cooldown.name}: {cooldown.count}</span>
								{:else}
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
