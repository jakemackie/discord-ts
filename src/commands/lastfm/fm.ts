import type { ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../../lib/prisma';
import {
	SlashCommandBuilder,
	EmbedBuilder,
	MessageFlags,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} from 'discord.js';

export default {
	category: 'lastfm',
	data: new SlashCommandBuilder().setName('login').setDescription('Login to Last.fm'),

	async execute(interaction: ChatInputCommandInteraction) {
		const user = await prisma.user.findUnique({
			where: {
				discordId: interaction.user.id
			}
		});

		const authUrl = `http://www.last.fm/api/auth/?api_key=${process.env.LASTFM_API_KEY}`;

		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setTimestamp();

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setLabel('Sign into Last.fm').setStyle(ButtonStyle.Link).setURL(authUrl)
		);

		if (user && !user.lastfmUsername) {
			const description = `${interaction.user.username} has not linked their [Last.fm](https://last.fm) account yet. Click the button below to get started.`;

			embed.setDescription(description);

			await interaction.reply({
				embeds: [embed],
				components: [row],
				flags: MessageFlags.Ephemeral
			});
		} else if (user && user.lastfmUsername) {
			const description = `${interaction.user.username} you are already logged in to Last.fm as **${user.lastfmUsername}**. If you meant to do this, you can sign into another account by using the button below.`;

			embed.setDescription(description);

			await interaction.reply({
				embeds: [embed],
				components: [row],
				flags: MessageFlags.Ephemeral
			});
		}
	}
};
