import { BotEvent, BotEventError } from '../../../core/BotWithCommands.js';
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

			transaction.setStatus('ok');
		} catch (error) {
			if (error instanceof Error) console.log(error.message);

			transaction.setStatus('internal_error');

			Sentry.captureException(error);
		}

		transaction.finish();
	},
};

export default guildCreate;
