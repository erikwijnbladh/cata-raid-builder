// src/routes/api/sendToDiscord/+server.js
import { json } from '@sveltejs/kit';

// const discordWebhookUrl =
// 	'https://discord.com/api/webhooks/1198327839712346232/SPasclWOTPQv8ouovAspR5q-OFVwQXmb7oocLV2q_-kJYnrPuqlh-bCUepcYtwKRS9xV';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { raidSetup, webhookUrl } = await request.json(); // Added webhookUrl

	// Transform raidSetup to a more readable format
	const formattedRaidSetup = raidSetup
		.map(
			(player) =>
				`${player.name} - ${player.classSpec ? player.classSpec.character : 'No Character Selected'}`
		)
		.join('\n');
	const message = { content: '```' + formattedRaidSetup + '```' };

	try {
		const discordResponse = await fetch(webhookUrl, {
			// Use webhookUrl here
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message)
		});

		if (discordResponse.ok) {
			return json({ message: 'Success' });
		} else {
			return json(
				{ message: 'Failed to send message to Discord' },
				{ status: discordResponse.status }
			);
		}
	} catch (error) {
		return json({ message: 'Server error' }, { status: 500 });
	}
}
