<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { wowClasses } from '../data/wowClasses.js';
	import { buffs as importedBuffs } from '../data/buffs.js';
	import { tokens as importedTokens } from '../data/tokens.js';
	import { cooldowns as importedCooldowns } from '../data/cooldowns.js';
	import { debuffs as importedDebuffs } from '../data/debuffs.js';
	import { Avatar } from '@skeletonlabs/skeleton';

	let buffs = importedBuffs;
	let tokens = importedTokens;
	let cooldowns = importedCooldowns;
	let debuffs = importedDebuffs;

	const copyRaidSetup = async () => {
		const raidSetupString = JSON.stringify(raidSetup, null, 2); // Pretty print the JSON
		await navigator.clipboard.writeText(raidSetupString);
		alert('Raid setup copied to clipboard!');
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
		buffs = buffs.map((buff) => {
			const count = raidSetup.reduce((count, player) => {
				return (
					count + (player.classSpec && buff.providers.includes(player.classSpec.label) ? 1 : 0)
				);
			}, 0);
			return { ...buff, count };
		});
	}

	$: {
		debuffs = debuffs.map((debuff) => {
			const count = raidSetup.reduce((count, player) => {
				return (
					count + (player.classSpec && debuff.providers.includes(player.classSpec.label) ? 1 : 0)
				);
			}, 0);
			return { ...debuff, count };
		});
	}

	$: {
		cooldowns = cooldowns.map((cooldown) => {
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
</script>

<div class="flex flex-row mx-20 justify-between gap-20">
	<div class="w-full">
		<form class="gap-8 grid grid-cols-2">
			{#each raidSetup as player, index}
				<div class="flex flex-col relative">
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
								class="ml-1 border-2 border-surface-500"
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
		<div class="flex flex-row justify-between">
			<div class="flex flex-row gap-4 my-auto">
				<button on:click={copyRaidSetup} type="button" class="btn variant-filled">Copy Raid</button>
				<button on:click={clearRaid} type="button" class="btn variant-filled">Reset Raid</button>
			</div>
			<div class="flex flex-col gap-4 mt-10">
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
							<div title="Providers: {buff.providers.join(', ')}">
								<span>&#x1F50D;</span>
								<!-- This is a magnifying glass icon -->
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
							<div title="Providers: {debuff.providers.join(', ')}">
								<span>&#x1F50D;</span>
								<!-- This is a magnifying glass icon -->

								{#if debuff.count == 0}
									<span class="text-red-400">
										{debuff.name}: {debuff.count}
									</span>
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
							<div title="Providers: {cooldown.providers.join(', ')}">
								<span>&#x1F50D;</span>
								<!-- This is a magnifying glass icon -->
								{#if cooldown.count == 0}
									<span class="text-red-400">
										{cooldown.name}: {cooldown.count}
									</span>
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
