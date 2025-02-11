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

const commands: ApplicationCommandDataResolvable[] = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Load and deploy commands
async function deployCommands() {
  try {
    // Load commands
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        console.log(filePath);
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

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // Deploy commands
    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    )) as ApplicationCommandData[];

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

// Execute the deployment
deployCommands();

// or delete command(s)

// singular

// for guild-based commands
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);

// for global commands
// rest.delete(Routes.applicationCommand(clientId, 'commandId'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);

// all

// for guild-based commands
// rest
//   .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
//   .then(() => console.log('Successfully deleted all guild commands.'))
//   .catch(console.error);

// for global commands
// rest.put(Routes.applicationCommands(clientId), { body: [] })
// 	.then(() => console.log('Successfully deleted all application commands.'))
// 	.catch(console.error);
