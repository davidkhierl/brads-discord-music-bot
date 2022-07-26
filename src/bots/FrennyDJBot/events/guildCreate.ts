import { BotEvent, BotEventError } from '../../../core/BotWithCommands.js';
import saveGuild from '../../../services/saveGuild.js';
import saveGuildRoles from '../../../services/saveGuildRoles.js';
import { Guild } from 'discord.js';

/**
 * Runs when bot joins a guild.
 * here we will save guild and roles data.
 */
const guildCreate: BotEvent<Guild> = {
	name: 'guildCreate',
	execute: async (guild) => {
		if (!guild.available) throw new BotEventError('Guild not available');

		// save the guild to database
		await saveGuild(guild);

		// filter only user created roles
		const roles = guild.roles.cache
			.filter((role) => !role.managed && role.name !== '@everyone')
			.toJSON();

		// save roles to database and connect it to guild
		await saveGuildRoles(roles);
	},
};

export default guildCreate;
