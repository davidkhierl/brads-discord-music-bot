import { BotEvent, BotEventError } from '../../../core/Bot.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import deleteGuild from '../../../services/deleteGuild.js';
import * as Sentry from '@sentry/node';
import { Guild } from 'discord.js';

/**
 * Runs when bot removed from the
 * guild. Deletes all guild records
 */
const guildCreate: BotEvent<Guild> = {
	name: 'guildDelete',
	execute: async (guild) => {
		const transaction = SentryHelper.startBotEventTransaction({
			bot: guild.client.user?.username,
			op: 'guildDelete',
		});

		Sentry.setContext('guild', {
			id: guild.id,
			name: guild.name,
		});

		try {
			if (!guild.available)
				throw new BotEventError('Guild not available');

			await deleteGuild(guild.id);

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
