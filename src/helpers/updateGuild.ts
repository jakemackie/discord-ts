import type { Guild as DiscordGuild } from 'discord.js';
import type { Guild } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logger } from '../logger';

export const updateGuild = async (guild: DiscordGuild, inactive = false): Promise<Guild | false> => {
	const guildInDatabase = await prisma.guild.findUnique({
		where: {
			discordId: guild.id
		}
	});

	if (!guildInDatabase) {
		throw new Error('Guild not found');
	}

	const updateData: Partial<Guild> = {};

	if (guild.name !== guildInDatabase.name) {
		logger.info(`Updating name for ${guild.name}`);
		updateData.name = guild.name;
	}

	if (inactive) {
		guildInDatabase.status = 'INACTIVE';
		logger.info(`Setting ${guild.name} (${guildInDatabase.id}) to inactive`);
	}

	if (Object.keys(updateData).length > 0) {
		return await prisma.guild.update({
			where: { id: guildInDatabase.id },
			data: updateData
		});
	}

	return false;
};
