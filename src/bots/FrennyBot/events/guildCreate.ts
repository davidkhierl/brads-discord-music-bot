import { BotEvent, BotEventError } from '../../../core/bot/Bot.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import saveGuild from '../../../services/saveGuild.js';
import saveGuildRoles from '../../../services/saveGuildRoles.js';
import * as Sentry from '@sentry/node';
import { Guild } from 'discord.js';

/**
 * Runs when bot joins a guild.
 * here we will save guild and roles data.
 */
const guildCreate: BotEvent<Guild> = {
	name: 'guildCreate',
	execute: async (guild) => {
		const transaction = SentryHelper.startBotEventTransaction({
			bot: guild.client.user?.username,
			op: 'guildCreate',
		});

		Sentry.setContext('guild', {
			id: guild.id,
			name: guild.name,
		});

		try {
			if (!guild.available)
				throw new BotEventError('Guild not available');

			// save the guild to database
			await saveGuild(guild);

			// filter only user created roles
			const roles = guild.roles.cache
				.filter((role) => !role.managed && role.name !== '@everyone')
				.toJSON();

			// save roles to database and connect it to guild
			await saveGuildRoles(roles);

			transaction.setStatus('ok');
		} catch (error) {
			console.log(error);

			transaction.setStatus('internal_error');

			Sentry.captureException(error);
		}

		transaction.finish();
	},
};

export default guildCreate;
