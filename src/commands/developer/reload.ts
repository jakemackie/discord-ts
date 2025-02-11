import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../structures/Client';

export default {
  category: 'developer',
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('The command to reload.')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const commandName = interaction.options
      .getString('command', true)
      .toLowerCase();
    const command = (interaction.client as ExtendedClient).commands.get(
      commandName
    );

    if (!command) {
      return interaction.reply(
        `There is no command with name \`${commandName}\`!`
      );
    }

    delete require.cache[
      require.resolve(`../${command.category}/${command.data.name}.js`)
    ];

    try {
      const newCommand = require(
        `../${command.category}/${command.data.name}.js`
      ).default;
      (interaction.client as ExtendedClient).commands.set(
        newCommand.data.name,
        newCommand
      );
      await interaction.reply(
        `Command \`${newCommand.data.name}\` was reloaded!`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${error instanceof Error ? error.message : 'Unknown error'}\``
      );
    }
  }
};
