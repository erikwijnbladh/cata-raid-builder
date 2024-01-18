// utils.js
export function processItems(items, wowClasses, raidSetup) {
	return items.map((item) => {
		// Count how many times each item is provided by the raid setup
		const count = raidSetup.reduce((acc, player) => {
			const playerSpecLabel = player.classSpec ? `${player.classSpec.label}` : '';
			return acc + (item.providers.includes(playerSpecLabel) ? 1 : 0);
		}, 0);

		// Group specializations by class
		let classSpecificItems = {};
		item.providers.forEach((provider) => {
			const [className, specName] = provider.split(' - ');
			if (!classSpecificItems[className]) {
				classSpecificItems[className] = [];
			}
			classSpecificItems[className].push(specName);
		});

		// Determine the display text for each item
		let displayText = [];
		for (const [className, specs] of Object.entries(classSpecificItems)) {
			const allSpecs = wowClasses[className].specs.map((specObj) => specObj.name);
			if (specs.sort().join(',') === allSpecs.sort().join(',')) {
				displayText.push(`All ${className}s`);
			} else {
				specs.forEach((spec) => {
					displayText.push(`${spec} ${className}`);
				});
			}
		}

		return { ...item, count, displayText: displayText.join(', ') };
	});
}
