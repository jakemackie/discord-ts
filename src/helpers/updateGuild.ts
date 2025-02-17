import type { Guild as DiscordGuild } from 'discord.js';
import type { Guild } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const updateGuild = async (guild: DiscordGuild): Promise<Guild | false> => {
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
		console.log(`Updating name for ${guild.name}`);
		updateData.name = guild.name;
	}

	if (Object.keys(updateData).length > 0) {
		return await prisma.guild.update({
			where: { id: guildInDatabase.id },
			data: updateData
		});
	}

	return false;
};
