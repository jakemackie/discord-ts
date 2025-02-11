import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { getSpotifySongUrl } from '../../helpers/getSpotifySongUrl';

export default {
  category: 'misc',
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Get the spotify activity of a user')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to get the avatar of')
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const member = await interaction.guild?.members.fetch(target.id);

    const listeningToSpotify = member?.presence?.activities.find(
      (activity) => activity.name === 'Spotify'
    );

    if (!listeningToSpotify) {
      return await interaction.reply({
        content: `**${target.username}** is not listening to Spotify`,
        flags: MessageFlags.Ephemeral
      });
    }

    const song = listeningToSpotify.details;
    const trackId = listeningToSpotify.syncId;
    const url = trackId
      ? getSpotifySongUrl(trackId, listeningToSpotify.party?.id ?? '')
      : null;
    const artist = listeningToSpotify.state;

    let description = `**${song}**\n-# ${artist}`;

    if (url) {
      description = `**[${song}](${url})**\n-# ${artist}`;
    }

    const spotifyEmbed = new EmbedBuilder()
      .setColor('#1DB954')
      .setAuthor({
        name: target.username,
        iconURL: target.displayAvatarURL()
      })
      .setDescription(description)
      .setThumbnail(
        listeningToSpotify.assets?.largeImage?.replace(
          'spotify:',
          'https://i.scdn.co/image/'
        ) ?? null
      )
      .setTimestamp();

    await interaction.reply({ embeds: [spotifyEmbed] });
  }
};
