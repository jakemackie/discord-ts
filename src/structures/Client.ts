import { Client, Collection, GatewayIntentBits, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { loadCommands } from '../handlers/loadCommands';
import { loadEvents } from '../handlers/loadEvents';

// Add an interface for your commands
export interface Command {
	data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	category: string;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class ExtendedClient extends Client {
	public commands: Collection<string, Command>;

	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
		});

		this.commands = new Collection();
	}

	async init(token: string) {
		await this.loadModules();
		await this.login(token);
	}

	private async loadModules() {
		await loadCommands(this);
		await loadEvents(this);
	}
}
