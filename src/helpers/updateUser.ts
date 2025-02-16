import type { User as DiscordUser } from 'discord.js';
import type { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const updateUser = async (user: DiscordUser): Promise<User | false> => {
	const userInDatabase = await prisma.user.findUnique({
		where: {
			discordId: user.id
		}
	});

	if (!userInDatabase) {
		throw new Error('User not found');
	}

	const updateData: Partial<User> = {};

	if (user.username !== userInDatabase.discordUsername) {
		console.log(`Updating username for ${user.username}`);
		updateData.discordUsername = user.username;
	}

	if (user.displayName !== userInDatabase.discordDisplayName) {
		console.log(`Updating display name for ${user.displayName}`);
		updateData.discordDisplayName = user.displayName;
	}

	if (Object.keys(updateData).length > 0) {
		return await prisma.user.update({
			where: { id: userInDatabase.id },
			data: updateData
		});
	}

	return false;
};
