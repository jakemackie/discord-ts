import { Events, Interaction, MessageFlags } from 'discord.js';
import { ExtendedClient } from '../structures/Client';
import { findOrCreateUser } from '../helpers/findOrCreateUser';
import { updateUser } from '../helpers/updateUser';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(({ level, message }) => {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}`;
  }),
  transports: [new winston.transports.Console()]
});

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
      const user = await findOrCreateUser(interaction.user);

      if (user) {
        const userUpdated = await updateUser(interaction.user);

        if (userUpdated) {
          logger.info(
            `Updated user: ${userUpdated.id} (${userUpdated.discordUsername})`
          );
        }
      }

      logger.info(
        `${interaction.user.username} (/) ${interaction.commandName}`
      );

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
