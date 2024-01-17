import { join } from 'path';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				normal: '#A8A878',
				fire: '#F08030',
				water: '#6890F0',
				electric: '#F8D030',
				grass: '#78C850',
				ice: '#98D8D8',
				fighting: '#C03028',
				poison: '#A040A0',
				ground: '#E0C068',
				flying: '#A890F0',
				psychic: '#F85888',
				bug: '#A8B820',
				rock: '#B8A038',
				ghost: '#705898',
				dragon: '#7038F8'
			},
			minWidth: {
				'2xl': '42rem',
				'3xl': '48rem'
			}
		}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'modern',
						enhancements: true
					}
				]
			}
		})
	]
};
