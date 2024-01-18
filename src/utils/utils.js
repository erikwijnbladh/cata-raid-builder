// utils.js
export function processItems(items, wowClasses, raidSetup) {
	return items.map((item) => {
		item.providerIcons = {};
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
		let iconURL = ''; // variable to hold the icon URL

		for (const [className, specs] of Object.entries(classSpecificItems)) {
			const classInfo = wowClasses[className];
			const allSpecs = classInfo.specs.map((specObj) => specObj.name);

			if (specs.sort().join(',') === allSpecs.sort().join(',')) {
				displayText.push(`All ${className}s`);
				// For 'All [Class]', use the class icon
				item.providerIcons[`All ${className}s`] = classInfo.icon;
			} else {
				specs.forEach((spec) => {
					const specName = `${spec} ${className}`;
					displayText.push(specName);
					// Find the spec icon and map it
					const specInfo = classInfo.specs.find((specObj) => specObj.name === spec);
					item.providerIcons[specName] = specInfo ? specInfo.icon : '';
				});
			}
		}

		return { ...item, count, displayText: displayText.join(', ') };
	});
}
