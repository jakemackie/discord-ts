import { Events, type Guild } from 'discord.js';
import { findOrCreateGuild } from '../helpers/findOrCreateGuild';
import { updateGuild } from '../helpers/updateGuild';

export default {
  name: Events.GuildCreate,
  once: true,
  async execute(guild: Guild) {
    console.log(`↪ joined ${guild.name} (${guild.id})`);
    await findOrCreateGuild(guild);
    await updateGuild(guild);
  }
};
