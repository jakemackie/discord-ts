import { Events, type Guild } from 'discord.js';
import { updateGuild } from '../helpers/updateGuild';

export default {
  name: Events.GuildDelete,
  once: true,
  async execute(guild: Guild) {
    console.log(`↪ left ${guild.name} (${guild.id})`);
    await updateGuild(guild);
  }
};
