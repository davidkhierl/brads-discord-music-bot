import { BotEvent, BotEventError } from '../../../core/BotWithCommands.js';
import deleteGuild from '../../../services/deleteGuild.js';
import { Guild } from 'discord.js';

/**
 * Runs when bot removed from the
 * guild. Deletes all guild records
 */
const guildCreate: BotEvent<Guild> = {
	name: 'guildDelete',
	execute: async (guild) => {
		if (!guild.available) throw new BotEventError('Guild not available');
		await deleteGuild(guild.id);
	},
};

export default guildCreate;
