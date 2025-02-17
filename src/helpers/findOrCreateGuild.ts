import type { Guild as DiscordGuild } from 'discord.js';
import type { Guild } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const findOrCreateGuild = async (guild: DiscordGuild): Promise<Guild> => {
	let guildInDatabase = await prisma.guild.findUnique({
		where: {
			discordId: guild.id
		}
	});

	if (guildInDatabase) {
		return guildInDatabase;
	}

	const owner = await guild.fetchOwner();

	guildInDatabase = await prisma.guild.create({
		data: {
			discordId: guild.id,
			name: guild.name,
			ownerId: owner.id,
			ownerUsername: owner.user.username,
			ownerDisplayName: owner.displayName
		}
	});

	console.log(
		`✨ ${guild.name} (${guildInDatabase.id}) used the bot for the first time, they've been added to the database.`
	);

	return guildInDatabase;
};
