// utils.js
export function processItems(items, wowClasses) {
	let wowClassesCopy = JSON.parse(JSON.stringify(wowClasses));

	return items.map((item) => {
		let classSpecificItems = {};

		// Group specializations by class
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
			const allSpecs = wowClassesCopy[className].map((specObj) => specObj.name);
			if (specs.sort().join(',') === allSpecs.sort().join(',')) {
				displayText.push(`All ${className}s`);
			} else {
				specs.forEach((spec) => {
					displayText.push(`${spec} ${className}`);
				});
			}
		}

		return { ...item, displayText: displayText.join(', ') };
	});
}
