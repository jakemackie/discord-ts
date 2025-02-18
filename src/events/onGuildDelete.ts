import { Events, Guild } from 'discord.js';
import { findOrCreateGuild } from '../helpers/findOrCreateGuild';
import { updateGuild } from '../helpers/updateGuild';
import { logger } from '../logger';

export default {
	name: Events.GuildDelete,
	once: false,
	execute: async (guild: Guild) => {
		const guildInDatabase = await findOrCreateGuild(guild);

		if (guildInDatabase) {
			logger.info(`${guild.name} (${guildInDatabase.id}) just removed the bot from the server.`);

			const guildUpdated = await updateGuild(guild, true);

			if (guildUpdated) {
				logger.info(`${guild.name} (${guildInDatabase.id}) has been set to inactive in the database.`);
			}
		}
	}
};
