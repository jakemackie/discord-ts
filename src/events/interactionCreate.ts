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

// Define the Discord API Error type
interface DiscordAPIError extends Error {
  code: number;
  status: number;
  method: string;
  url: string;
  message: string;
}

// Add error handling utility
function isDiscordAPIError(error: unknown): error is DiscordAPIError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'status' in error &&
    'message' in error
  );
}

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
    } catch (error: unknown) {
      // Handle Discord API Errors
      if (isDiscordAPIError(error)) {
        logger.error(
          `Discord API Error ${error.code} (${error.status}): ${error.message}\nEndpoint: ${error.method} ${error.url}`
        );

        let errorMessage: string;
        switch (error.code) {
          case 10007:
            errorMessage = 'Unable to find the specified user in this server.';
            break;
          case 50001:
            errorMessage = 'Bot lacks permissions to perform this action.';
            break;
          case 50013:
            errorMessage =
              'Bot lacks permissions to perform this action in this channel.';
            break;
          case 50007:
            errorMessage = 'Cannot send messages to this user.';
            break;
          case 10008:
            errorMessage = 'Message no longer exists.';
            break;
          case 130000:
            errorMessage = 'Resource is overloaded. Please try again later.';
            break;
          default:
            errorMessage = `An error occurred: ${error.message} (Error ${error.code})`;
        }

        // Send error response
        if (interaction.replied || interaction.deferred) {
          await interaction
            .followUp({
              content: errorMessage,
              flags: MessageFlags.Ephemeral
            })
            .catch((err) => {
              logger.error(`Failed to send error followUp: ${err}`);
            });
        } else {
          await interaction
            .reply({
              content: errorMessage,
              flags: MessageFlags.Ephemeral
            })
            .catch((err) => {
              logger.error(`Failed to send error reply: ${err}`);
            });
        }
      } else {
        // Handle unknown errors
        logger.error(`Unexpected error during command execution:`, error);

        const errorMessage =
          'An unexpected error occurred. Please try again later.';

        if (interaction.replied || interaction.deferred) {
          await interaction
            .followUp({
              content: errorMessage,
              flags: MessageFlags.Ephemeral
            })
            .catch((err) => {
              logger.error(`Failed to send error followUp: ${err}`);
            });
        } else {
          await interaction
            .reply({
              content: errorMessage,
              flags: MessageFlags.Ephemeral
            })
            .catch((err) => {
              logger.error(`Failed to send error reply: ${err}`);
            });
        }
      }
    }
  }
};
