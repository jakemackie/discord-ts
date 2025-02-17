import { Events, Guild } from 'discord.js';
import { findOrCreateGuild } from '../helpers/findOrCreateGuild';
import { updateGuild } from '../helpers/updateGuild';
import { logger } from '../logger';
export default {
	name: Events.GuildCreate,
	once: false,
	execute: async (guild: Guild) => {
        const guildInDatabase = await findOrCreateGuild(guild);

        if (guildInDatabase) {
            const guildUpdated = await updateGuild(guild);

            if (guildUpdated) {
                logger.info(`${guild.name} (${guildInDatabase.id}) has been updated in the database.`);
            }

            logger.info(`${guild.name} (${guildInDatabase.id}) has been added to the database.`);
        }
	}
}
