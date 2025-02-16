import { Events } from 'discord.js';
import { ExtendedClient } from '../structures/Client';

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: ExtendedClient) {
		console.log(`Ready! Logged in as ${client.user?.tag}`);
	}
};
