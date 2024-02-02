<script lang="ts">
	import { getToastStore, Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { wowClasses } from '../data/wowClasses.js';
	import { buffs as importedBuffs } from '../data/buffs.js';
	import { tokens as importedTokens } from '../data/tokens.js';
	import { cooldowns as importedCooldowns } from '../data/cooldowns.js';
	import { debuffs as importedDebuffs } from '../data/debuffs.js';
	import { processItems } from '../utils/utils.js';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	import Tooltip from '../components/+Tooltip.svelte';
	import TooltipContent from '../components/+TooltipContent.svelte';

	const toastStore = getToastStore();

	let buffs = importedBuffs;
	let tokens = importedTokens;
	let cooldowns = importedCooldowns;
	let debuffs = importedDebuffs;

	let combinedOptions = [];
	for (const className in wowClasses) {
		wowClasses[className].specs.forEach((spec) => {
			combinedOptions.push({
				icon: spec.icon,
				character: `${className} - ${spec.name}`
			});
		});
	}

	let raidSetup = Array.from({ length: 10 }, () => ({ name: '', classSpec: null }));
	$: allClassSpecsNull = raidSetup.every((player) => player.classSpec === null);
	const copyRaidSetup = async () => {
		// Check if every classSpec in raidSetup is null

		if (allClassSpecsNull) {
			const toastSettings: ToastSettings = {
				message: 'Add at least one character',
				background: 'variant-filled-error',
				hideDismiss: true,
				timeout: 3000
			};
			toastStore.trigger(toastSettings);
			return;
		}

		// Transform raidSetup to only include name and character
		const simplifiedRaidSetup = raidSetup.map((player) => ({
			name: player.name,
			character: player.classSpec ? player.classSpec.character : null
		}));

		const raidSetupString = JSON.stringify(simplifiedRaidSetup, null, 2);
		await navigator.clipboard.writeText(raidSetupString);

		const toastSettings: ToastSettings = {
			message: 'Raid setup copied to clipboard!',
			background: 'variant-filled-success',
			hideDismiss: true,
			timeout: 3000
		};
		toastStore.trigger(toastSettings);
	};

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

	let importedRaidSetupJson = '';

	function importRaidSetup() {
		try {
			const importedRaidSetup = JSON.parse(importedRaidSetupJson);
			if (Array.isArray(importedRaidSetup) && importedRaidSetup.length === raidSetup.length) {
				raidSetup = importedRaidSetup.map((player) => {
					const matchingSpec = combinedOptions.find(
						(option) => option.character === player.character
					);
					return {
						name: player.name,
						classSpec: matchingSpec || null
					};
				});
				const toastSettings: ToastSettings = {
					message: 'Raid setup imported!',
					background: 'variant-filled-success',
					hideDismiss: true,
					timeout: 3000
				};
				toastStore.trigger(toastSettings);
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

	async function sendToDiscord() {
		const response = await fetch('/api/sendToDiscord', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				raidSetup,
				webhookUrl: webHook // Include the webhook URL here
			})
		});

		if (response.ok) {
			const toastSettings: ToastSettings = {
				message: 'Raid setup sent to discord!',
				background: 'variant-filled-success',
				hideDismiss: true,
				timeout: 3000
			};
			toastStore.trigger(toastSettings);
		} else {
			console.error('Failed to send message to server endpoint', response);
			const toastSettings: ToastSettings = {
				message: 'Something went wrong, make sure you have added a valid webhook',
				background: 'variant-filled-success',
				hideDismiss: true,
				timeout: 3000
			};
			toastStore.trigger(toastSettings);
		}
	}

	$: webHook = '';
	let storedWebhook = ''; // Variable to hold the webhook from local storage

	// Fetch the stored webhook on component mount
	onMount(() => {
		storedWebhook = localStorage.getItem('discordWebhook') || '';
		webHook = storedWebhook; // Optional: Initialize webHook with the stored value
	});

	// Function to save webhook
	function saveWebhook() {
		localStorage.setItem('discordWebhook', webHook);
		storedWebhook = webHook;
		const toastSettings: ToastSettings = {
			message: 'Webhook saved',
			background: 'variant-filled-success',
			hideDismiss: true,
			timeout: 3000
		};
		toastStore.trigger(toastSettings);
	}

	// Function to delete webhook
	function deleteWebhook() {
		localStorage.removeItem('discordWebhook');
		const toastSettings: ToastSettings = {
			message: 'Webhook removed',
			background: 'variant-filled-success',
			hideDismiss: true,
			timeout: 3000
		};
		toastStore.trigger(toastSettings);
		webHook = '';
	}

	// Reactive statement to determine if the save button should be disabled
	$: isSaveDisabled = !webHook || webHook === storedWebhook;

	function toggleRaidSize() {
		if (raidSetup.length === 10) {
			raidSetup = Array.from({ length: 25 }, () => ({ name: '', classSpec: null }));
		} else {
			raidSetup = Array.from({ length: 10 }, () => ({ name: '', classSpec: null }));
		}
		raidSetup = raidSetup; // explicitly reassign to trigger reactivity
	}
	let gridClass = 'grid-cols-2'; // default class

	// Reactive statement to update gridClass
	$: gridClass = raidSetup.length === 25 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2';
	import ClassPicker from '../components/+ClassPicker.svelte';
	import Popover from '../components/+Popover.svelte';
	let openPickerIndex = null; // Tracks which ClassPicker is open

	// Function to toggle the ClassPicker open state
	function togglePicker(index) {
		if (openPickerIndex === index) {
			openPickerIndex = null; // Close the current picker if it's already open
		} else {
			openPickerIndex = index; // Open the clicked picker and close others
		}
	}
	$: raidGroups = raidSetup.reduce((acc, player, index) => {
		const groupIndex = Math.floor(index / 5); // Calculate which group the player belongs to
		if (!acc[groupIndex]) {
			acc[groupIndex] = []; // Initialize the group if it doesn't exist
		}
		acc[groupIndex].push(player); // Add the player to the correct group
		return acc;
	}, []);
</script>

<div class="flex flex-col md:flex-row mx-4 md:mx-20 justify-between gap-20">
	<div class="w-full">
		<div class="flex flex-row justify-between font-semibold gap-2 pb-6">
			<div class="flex flex-row gap-2">
				<p>10man</p>
				<SlideToggle
					on:change={toggleRaidSize}
					name="slider"
					background="bg-surface-300"
					active="bg-surface-600"
					size="sm"
				/>
				<p>25man</p>
			</div>

			<Popover>
				<div class="flex flex-col gap-4 p-4">
					<button on:click={copyRaidSetup} type="button" class="btn btn-sm variant-filled"
						>Copy Raid</button
					>
					<button on:click={clearRaid} type="button" class="btn btn-sm variant-filled"
						>Reset Raid</button
					>
					<button
						on:click={sendToDiscord}
						disabled={!webHook || allClassSpecsNull}
						type="button"
						class="btn btn-sm variant-filled">Send to Discord</button
					>
					<button
						on:click={deleteWebhook}
						disabled={!webHook || !localStorage.getItem('discordWebhook')}
						type="button"
						class="btn btn-sm variant-filled">Remove Webhook</button
					>
				</div>
			</Popover>
		</div>
		<div class="flex flex-col md:flex-row">
			<div class="flex flex-col w-full my-4 gap-4 border-b pb-4">
				<div class="flex flex-row gap-2">
					<input
						bind:value={importedRaidSetupJson}
						type="text"
						class="input w-1/2 h-8 my-auto font-bold"
						placeholder="Paste raid data here"
					/>
					<button
						on:click={importRaidSetup}
						disabled={!importedRaidSetupJson}
						type="button"
						class="btn btn-sm variant-filled">Import Raid</button
					>
				</div>
				<div class="flex flex-row gap-2">
					<input
						bind:value={webHook}
						type="password"
						class="input w-1/2 h-8 my-auto font-bold"
						placeholder="Paste webhook here"
					/>
					<button
						on:click={saveWebhook}
						disabled={isSaveDisabled}
						type="button"
						class="btn btn-sm variant-filled"
					>
						{webHook ? 'Save webhook' : 'Add a discord webhook'}
					</button>
					<Tooltip>
						<span class="badge variant-filled mt-1 px-2.5">?</span>
						<TooltipContent slot="content">
							<div class="card rounded-lg py-2 px-3">
								<p class="text-sm mb-2">
									This webhook is stored in localStorage and used to send your raid setup to your
									discord server. <br />
									You can read about webhooks
									<a
										class="underline"
										href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
										>here</a
									>
								</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
		<form class="gap-8 grid {gridClass}">
			{#each raidGroups as group, groupIndex}
				<div class="space-y-2">
					<h3>Group {groupIndex + 1}</h3>
					{#each group as player, index}
						<div class="flex flex-col relative space-y-8">
							<div class="flex flex-row justify-between gap-2">
								<ClassPicker
									bind:value={player.classSpec}
									options={combinedOptions}
									isOpen={openPickerIndex === groupIndex * 5 + index}
									on:toggle={() => togglePicker(groupIndex * 5 + index)}
									on:change={(e) => (player.classSpec = e.detail.value)}
								/>
								<input
									type="text"
									class="input w-full font-bold my-auto h-8 text-sm"
									placeholder={`Player ${index + 1} name`}
									bind:value={player.name}
									on:input={(e) => handleNameChange(groupIndex * 5 + index, e)}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</form>
	</div>
	<div class="w-full">
		<Accordion class="select-none card p-4  flex flex-col justify-between">
			<AccordionItem open>
				<svelte:fragment slot="summary">Buffs</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-8 py-4 relative">
						{#each buffs as buff}
							<div>
								<Tooltip>
									<TooltipContent slot="content">
										<div class="card rounded-lg py-2 px-3">
											<p class="text-sm mb-2">Providers:</p>
											{#each Object.entries(buff.providerIcons) as [provider, iconURL]}
												<div class="flex items-center mb-1">
													<img src={iconURL} alt={provider} class="h-5 w-5 mr-2 rounded-full" />
													<span class="text-sm font-semibold">{provider}</span>
												</div>
											{/each}
										</div>
									</TooltipContent>
									<!-- Normal content -->
									<div>
										{#if buff.count == 0}
											<span>⚠️</span>
											{buff.name}: {buff.count}
										{:else}
											<span>&#x1F50D;</span>
											{buff.name}: {buff.count}
										{/if}
									</div>
								</Tooltip>
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
							<div>
								<Tooltip>
									<TooltipContent slot="content">
										<div class="card rounded-lg py-2 px-3">
											<p class="text-sm mb-2">Providers:</p>
											{#each Object.entries(debuff.providerIcons) as [provider, iconURL]}
												<div class="flex items-center mb-1">
													<img src={iconURL} alt={provider} class="h-5 w-5 mr-2 rounded-full" />
													<span class="text-sm font-semibold">{provider}</span>
												</div>
											{/each}
										</div>
									</TooltipContent>
									<!-- Normal content -->
									<div>
										{#if debuff.count == 0}
											<span>⚠️</span>
											{debuff.name}: {debuff.count}
										{:else}
											<span>&#x1F50D;</span>
											{debuff.name}: {debuff.count}
										{/if}
									</div>
								</Tooltip>
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
							<div>
								<Tooltip>
									<TooltipContent slot="content">
										<div class="card rounded-lg py-2 px-3">
											<p class="text-sm mb-2">Providers:</p>
											{#each Object.entries(cooldown.providerIcons) as [provider, iconURL]}
												<div class="flex items-center mb-1">
													<img src={iconURL} alt={provider} class="h-5 w-5 mr-2 rounded-full" />
													<span class="text-sm font-semibold">{provider}</span>
												</div>
											{/each}
										</div>
									</TooltipContent>
									<!-- Normal content -->
									<div>
										{#if cooldown.count == 0}
											<span>⚠️</span>
											{cooldown.name}: {cooldown.count}
										{:else}
											<span>&#x1F50D;</span>
											{cooldown.name}: {cooldown.count}
										{/if}
									</div>
								</Tooltip>
							</div>
						{/each}
					</div>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
		<div class="flex flex-col gap-4 mt-6 w-full">
			<span class="text-center text-2xl"> Tokens </span>
			<div class="flex flex-row justify-center gap-4">
				{#each tokens as token}
					<div>
						{token.name}: {token.count}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
