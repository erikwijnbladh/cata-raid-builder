<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	const wowClasses = {
			'Warrior': [
				{ name: 'Protection' },
					{ name: 'Arms' },
					{ name: 'Fury' },
			],
			'Death Knight': [
					{ name: 'Blood' },
					{ name: 'Unholy' },
					{ name: 'Frost' },
			],
			'Druid': [
					{ name: 'Balance' },
					{ name: 'Feral' },
					{ name: 'Restoration' },
			],
			'Hunter': [
					{ name: 'Beast Mastery' },
					{ name: 'Marksmanship' },
					{ name: 'Survival' },
			],
			'Mage': [
					{ name: 'Arcane' },
					{ name: 'Fire' },
					{ name: 'Frost' },
			],
			'Paladin': [
					{ name: 'Holy' },
					{ name: 'Protection' },
					{ name: 'Retribution' },
			],
			'Priest': [
					{ name: 'Discipline' },
					{ name: 'Holy' },
					{ name: 'Shadow' },
			],
			'Rogue': [
					{ name: 'Assassination' },
					{ name: 'Combat' },
					{ name: 'Subtlety' },
			],
			'Shaman': [
					{ name: 'Elemental' },
					{ name: 'Enhancement' },
					{ name: 'Restoration' },
			],
			'Warlock': [
					{ name: 'Affliction' },
					{ name: 'Demonology' },
					{ name: 'Destruction' },
			],

	};
	const copyRaidSetup = async () => {
        const raidSetupString = JSON.stringify(raidSetup, null, 2); // Pretty print the JSON
        await navigator.clipboard.writeText(raidSetupString);
        alert('Raid setup copied to clipboard!');
    };

	let combinedOptions = [];
	for (const wowClass in wowClasses) {
			wowClasses[wowClass].forEach(specObj => {
					combinedOptions.push({
							label: `${wowClass} - ${specObj.name}`,
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

	function handleClassSpecChange(index, event) {
			const selectedOption = combinedOptions.find(option => option.label === event.target.value);
			raidSetup[index].classSpec = selectedOption;
	}
// BUFFS
	let buffs = [
			{ name: '+10% Melee Speed', providers: [
            'Shaman - Enhancement',
            'Shaman - Elemental', 
            'Shaman - Restoration',
            'Death Knight - Frost',
						'Hunter - Survival'
        ], count: 0 },
			{ name: '+5% Crit', providers: [
				'Druid - Feral',
				'Shaman - Elemental',
				'Warrior - Fury',
				'Rogue - Subtlety',
			], count: 0 },
			{ name: '+10% Attack Power', providers: [
						'Shaman - Enhancement',
						'Death Knight - Blood',
						'Hunter - Marksmanship',
						'Paladin - Retribution',
						'Paladin - Holy',
						'Paladin - Protection',
				], count: 0 },
				{ name: '+5% Spell Haste', providers: [
				'Druid - Balance',
				'Priest - Shadow',
				'Shaman - Enhancement',
				'Shaman - Elemental', 
				'Shaman - Restoration',
			], count: 0 },
			{ name: '+10% Spell Power', providers: [
				'Shaman - Elemental', 
				'Warlock - Demonology',
			], count: 0 },
			{ name: '+6% Spell Power', providers: [
				'Mage - Arcane',
				'Mage - Fire',
				'Mage - Frost',
				'Shaman - Enhancement',
            'Shaman - Elemental', 
            'Shaman - Restoration',
			], count: 0 },
			{ name: '+3% Damage', providers: [
				'Mage - Arcane',
				'Paladin - Retribution',
				'Hunter - Beast Mastery',
			], count: 0 },
			{ name: '+5% Stats', providers: [
				'Druid - Feral',
				'Druid - Balance',
				'Druid - Restoration',
				'Paladin - Holy',
				'Paladin - Protection',
				'Paladin - Retribution',
			], count: 0 },
			{ name: '+Strength and Agility', providers: [
            'Warrior - Arms', 
            'Warrior - Fury', 
            'Warrior - Protection',
            'Shaman - Enhancement',
            'Shaman - Elemental', 
            'Shaman - Restoration',
            'Death Knight - Blood',
            'Death Knight - Frost',
            'Death Knight - Unholy'
        ], count: 0 },
				{ name: '+Stamina', providers: [
					'Warrior - Arms', 
            'Warrior - Fury', 
            'Warrior - Protection',
						'Priest - Discipline',
						'Priest - Holy',
						'Priest - Shadow',
						'Warlock - Destruction',
			], count: 0 },
				{ name: '+Mana', providers: [
						'Mage - Arcane',
						'Mage - Fire',
						'Mage - Frost',
						'Warlock - Affliction',
			], count: 0 },


			{ name: '+Armor', providers: [
				'Shaman - Enhancement',
				'Shaman - Elemental',
				'Shaman - Restoration',
				'Paladin - Holy',
				'Paladin - Protection',
				'Paladin - Retribution',
			], count: 0 },
			{ name: 'Resistance', providers: [
				'Shaman - Enhancement',
				'Shaman - Elemental',
				'Shaman - Restoration',
				'Paladin - Holy',
				'Paladin - Protection',
				'Paladin - Retribution',
				'Priest - Discipline',
				'Priest - Holy',
				'Priest - Shadow',
				'Druid - Balance',
				'Druid - Feral',
				'Druid - Restoration',
				'Hunter - Beast Mastery',
				'Hunter - Marksmanship',
				'Hunter - Survival',
			], count: 0 },
			{ name: 'Pushback Resist', providers: [
				'Paladin - Holy',
				'Paladin - Protection',
				'Paladin - Retribution',
				'Shaman - Enhancement',
				'Shaman - Elemental',
				'Shaman - Restoration',
			], count: 0 },
			{ name: 'Replenishment', providers: [
				'Druid - Restoration',
				'Priest - Shadow',
				'Paladin - Retribution',
				'Warlock - Destruction',
				'Mage - Frost',
			], count: 0 },
			{ name: '+MP5', providers: [
				'Paladin - Holy',
				'Paladin - Protection',
				'Paladin - Retribution',
				'Shaman - Enhancement',
				'Shaman - Elemental',
				'Shaman - Restoration',
				'Warlock - Affliction',
			], count: 0 },

			// Add more buffs and providers here
			
	];

	$: {
    buffs = buffs.map(buff => {
        const count = raidSetup.reduce((count, player) => {
            return count + (player.classSpec && buff.providers.includes(player.classSpec.label) ? 1 : 0);
        }, 0);
        return { ...buff, count };
    });
	}
//
	// DEBUFFS
	let debuffs = [
    { name: 'Sunder Armor', 
		providers: ['Warrior - Arms', 'Warrior - Fury', 'Warrior - Protection',
		'Rogue - Assassination', 'Rogue - Combat', 'Rogue - Subtlety',
		'Druid - Feral', 'Druid - Restoration', 'Druid - Balance',

	], 
		count: 0 },
    { name: '+30% Bleed Damage', providers: ['Rogue - Subtlety', 'Druid - Feral', 'Warrior - Arms'], count: 0 },
    { name: '+5% Spell Crit', providers: ['Mage - Fire', 'Warlock - Destruction'], count: 0 },
    { name: '-20% Melee Haste', providers: [
			'Death Knight - Frost', 
			'Death Knight - Unholy',
			'Death Knight - Blood',
		'Paladin - Protection',
		'Warrior - Protection',
			'Druid - Feral'
		], count: 0 },
    { name: '+8% Magic Damage Taken', providers: [
			'Warlock - Affliction', 
			'Warlock - Destruction', 
			'Warlock - Demonology',
			'Druid - Balance',
			'Death Knight - Unholy',
			'Rogue - Assassination',
		], count: 0 },
    { name: '+4% Physical Damage Taken', providers: ['Warrior - Arms', 'Death Knight - Frost',
		'Rogue - Combat'
	], count: 0 },
    { name: 'Healing Reduction', providers: [
			'Warrior - Arms', 
			'Warrior - Fury', 
			'Hunter - Marksmanship',
			'Hunter - Survival',
			'Hunter - Beast Mastery',
			'Rogue - Assassination',
			'Rogue - Combat',
			'Rogue - Subtlety',
			'Priest - Shadow',
			'Warlock - Demonology',
		], count: 0 },
    { name: '-10% Physical Damage Done', providers: [
			'Warrior - Arms', 
			'Warrior - Fury', 
			'Warrior - Protection', 
			'Paladin - Protection',
			'Death Knight - Blood',
			'Druid - Feral',
			'Warlock - Demonology',
			'Warlock - Destruction',
			'Warlock - Affliction',
		], count: 0 },
		{ name: '-Spell Haste', providers: [
			'Rogue - Assassination',
			'Rogue - Combat',
			'Rogue - Subtlety',
			'Mage - Arcane',
			'Death Knight - Blood',
			'Deadth Knight - Frost',
			'Death Knight - Unholy',
			'Warlock - Demonology',
			'Warlock - Destruction',
			'Warlock - Affliction',
		], count: 0 },
    // Add more debuffs and providers here
];

$: {
    debuffs = debuffs.map(debuff => {
        const count = raidSetup.reduce((count, player) => {
            return count + (player.classSpec && debuff.providers.includes(player.classSpec.label) ? 1 : 0);
        }, 0);
        return { ...debuff, count };
    });
}
//

// CDS
let cooldowns = [
    { 
        name: 'Combat Resurrection', 
        providers: [
            'Druid - Balance',
            'Druid - Feral',
            'Druid - Restoration',
            'Warlock - Affliction',
            'Warlock - Demonology',
            'Warlock - Destruction',
            'Shaman - Elemental',
            'Shaman - Enhancement',
            'Shaman - Restoration',
        ], 
        count: 0 
    },
    { 
        name: 'Bloodlust', 
        providers: [
            'Shaman - Enhancement',
            'Shaman - Elemental',
            'Shaman - Restoration',
            'Mage - Arcane',
            'Mage - Fire',
            'Mage - Frost',
        ], 
        count: 0 
    },
    { 
        name: 'Divine Sacrifice', 
        providers: [
						'Paladin - Protection',
        ], 
        count: 0 
    },
    { 
        name: 'Aura Mastery', 
        providers: [
						'Paladin - Holy',
        ], 
        count: 0 
    },
		{ 
        name: 'Power Word: Barrier',
        providers: [
            'Priest - Discipline',
        ], 
        count: 0 
    },
		{ 
        name: 'Power Infusion',
        providers: [
            'Priest - Discipline',
        ], 
        count: 0 
    },
		{ 
        name: 'Hymn of Hope',
        providers: [
            'Priest - Discipline',
            'Priest - Shadow',
            'Priest - Holy',
        ], 
        count: 0 
    },
		{ 
        name: 'Hymn of Hope',
        providers: [
            'Priest - Discipline',
            'Priest - Shadow',
            'Priest - Holy',
        ], 
        count: 0 
    },
		{ 
        name: 'Divine Hymn',
        providers: [
            'Priest - Discipline',
            'Priest - Shadow',
            'Priest - Holy',
        ], 
        count: 0 
    },
		{ 
        name: 'Guardian Spirit',
        providers: [
            'Priest - Holy',
        ], 
        count: 0 
    },
		{ 
				name: 'Pain Suppression',
				providers: [
						'Priest - Discipline',
				], 
				count: 0 
		},
		{
				name: 'Spirit Link Totem',
				providers: [
						'Shaman - Restoration',
				],
				count: 0
		},
		{
				name: 'Healing Tide Totem',
				providers: [
						'Shaman - Restoration',
				],
				count: 0
		},
		{
				name: 'Innervate',
				providers: [
						'Druid - Balance',
						'Druid - Restoration',
						'Druid - Feral',
				],
				count: 0
		},
		{
				name: 'Tranquility',
				providers: [
						'Druid - Balance',
						'Druid - Restoration',
						'Druid - Feral',
				],
				count: 0
		},
		{
				name: 'Stampeding Roar',
				providers: [
						'Druid - Balance',
						'Druid - Restoration',
						'Druid - Feral',
				],
				count: 0
		},
		{
				name: 'Anti Magic Zone',
				providers: [
			'Death Knight - Unholy',
				],
				count: 0
		},
    // Add more cooldowns and providers here
];

$: {
    cooldowns = cooldowns.map(cooldown => {
        const count = raidSetup.reduce((count, player) => {
            return count + (player.classSpec && cooldown.providers.includes(player.classSpec.label) ? 1 : 0);
        }, 0);
        return { ...cooldown, count };
    });
}
//
// ARMOR TOKENS
let tokens = [
		{
				name: 'Conqueror',
				providers: [
				'Warlock - Affliction',
				'Warlock - Demonology',
				'Warlock - Destruction',
				'Paladin - Holy',
				'Paladin - Protection',
				'Paladin - Retribution',
				'Priest - Discipline',
				'Priest - Holy',
				'Priest - Shadow',
				],
				count: 0
		},
		{
				name: 'Vanquisher',
				providers: [
			'Death Knight - Unholy',
			'Death Knight - Frost',
			'Death Knight - Blood',
			'Druid - Feral',
			'Druid - Balance',
			'Druid - Restoration',
			'Mage - Arcane',
			'Mage - Fire',
			'Mage - Frost',
			'Rogue - Assassination',
			'Rogue - Combat',
			'Rogue - Subtlety',

				],
				count: 0
		},
		{
				name: 'Protector',
				providers: [
			'Warrior - Arms',
			'Warrior - Fury',
			'Warrior - Protection',
			'Hunter - Beast Mastery',
			'Hunter - Marksmanship',
			'Hunter - Survival',
			'Shaman - Enhancement',
			'Shaman - Elemental',
			'Shaman - Restoration',
				],
				count: 0
		},
    // Add more tokens and providers here
];

$: {
    tokens = tokens.map(token => {
        const count = raidSetup.reduce((count, player) => {
            return count + (player.classSpec && token.providers.includes(player.classSpec.label) ? 1 : 0);
        }, 0);
        return { ...token, count };
    });
}
//
</script>

<div class="flex flex-row mx-20 justify-between gap-20">
	<div class="w-full">
			<form class="gap-8 grid grid-cols-2">
					{#each raidSetup as player, index}
					<div class="flex flex-col gap-2">
							<input type="text" class="input w-1/2 font-bold" placeholder={`Character ${index + 1} Name`}
									bind:value={player.name} on:input={(e) => handleNameChange(index, e)} />
									<select class="select" bind:value={player.classSpec}>
										<option value={null}>Select Class</option>
										{#each combinedOptions as option}
												<option value={option}>{option.label}</option>
										{/each}
								</select>
					</div>
					{/each}
			</form>
			<div class="flex flex-col justify-center gap-4 mt-10">
				<span class="text-center text-2xl">
					Tokens
				</span>
				<div class="flex flex-row justify-center gap-4 mt-4">
				{#each tokens as token}
					<div >
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
			<div class="flex flex-row justify-center gap-4 mt-10">
				<button 
				on:click={copyRaidSetup}
				type="button" class="btn variant-filled">Copy Raid</button>
				<button 
				on:click={clearRaid}
				type="button" class="btn variant-filled">Reset Raid</button>
			</div>	
	</div>
	<div class="card p-4 w-full flex flex-col justify-between">
		<div>
			<Accordion>
					<AccordionItem open>
							<svelte:fragment slot="summary">Buffs</svelte:fragment>
							<svelte:fragment slot="content">
								<div class="grid grid-cols-3 gap-8 py-4">
									{#each buffs as buff}
									<div title="Providers: {buff.providers.join(', ')}">
											<span>&#x1F50D;</span> <!-- This is a magnifying glass icon -->
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
												<span>&#x1F50D;</span> <!-- This is a magnifying glass icon -->
												
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
											<span>&#x1F50D;</span> <!-- This is a magnifying glass icon -->
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
</div>

<style lang="postcss">
</style>