import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { loadCommands } from '../handlers/loadCommands';
import { loadEvents } from '../handlers/loadEvents';

export class ExtendedClient extends Client {
  public commands: Collection<string, any>;

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
