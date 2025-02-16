import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar of a user')
		.addUserOption((option) => option.setName('user').setDescription('The user to get the avatar of')),
	async execute(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser('user') ?? interaction.user;

		const avatarEmbed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setDescription(`[${target.username}](${target.displayAvatarURL()})`)
			.setImage(
				target.displayAvatarURL({
					size: 1024
				})
			)
			.setTimestamp();

		await interaction.reply({ embeds: [avatarEmbed] });
	}
};
