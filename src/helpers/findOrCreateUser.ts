import type { User as DiscordUser } from 'discord.js';
import type { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const findOrCreateUser = async (user: DiscordUser): Promise<User> => {
	let userInDatabase = await prisma.user.findUnique({
		where: {
			discordId: user.id
		}
	});

	if (userInDatabase) {
		return userInDatabase;
	}

	userInDatabase = await prisma.user.create({
		data: {
			discordId: user.id,
			discordUsername: user.username,
			discordDisplayName: user.displayName
		}
	});

	console.log(
		`✨ ${user.username} (${userInDatabase.id}) used the bot for the first time, they've been added to the database.`
	);

	return userInDatabase;
};
