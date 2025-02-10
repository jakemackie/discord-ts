import { Events, Interaction, MessageFlags } from 'discord.js';
import { ExtendedClient } from '../index';
import { prisma } from '../../lib/prisma';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as ExtendedClient).commands.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      let userInDatabase = await prisma.user.findUnique({
        where: {
          discordId: interaction.user.id
        }
      });

      if (!userInDatabase) {
        userInDatabase = await prisma.user.create({
          data: {
            discordId: interaction.user.id,
            discordUsername: interaction.user.username,
            discordDisplayName: interaction.user.displayName
          }
        });
      }

      console.log(userInDatabase);

      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
      }
    }
  }
};
