import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  REST,
  Routes,
  type ApplicationCommandData,
  type ApplicationCommandDataResolvable
} from 'discord.js';

dotenv.config();

const token: string = process.env.DISCORD_CLIENT_TOKEN;
const clientId: string = process.env.DISCORD_CLIENT_ID;
const guildId: string = process.env.DISCORD_GUILD_ID;

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Refactored command loading function
async function loadCommands(): Promise<ApplicationCommandDataResolvable[]> {
  const commands: ApplicationCommandDataResolvable[] = [];

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      console.log(`Loading command from ${filePath}`);
      const command = (await import(filePath)).default;
      if (command?.data && command?.execute) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  return commands;
}

// Deploy commands function
async function deployCommands(isGlobal: boolean) {
  try {
    const route = isGlobal
      ? Routes.applicationCommands(clientId)
      : Routes.applicationGuildCommands(clientId, guildId);

    const commands = await loadCommands();
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = (await rest.put(route, {
      body: commands
    })) as ApplicationCommandData[];
    console.log(
      `Successfully reloaded ${data.length} ${isGlobal ? 'global' : 'guild'} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

// Execute the deployment based on --global flag
const isGlobal = process.argv.includes('--global');
deployCommands(isGlobal);
