import { BotEvent, BotEventError } from '../../../core/bot/Bot.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import deleteGuild from '../../../services/deleteGuild.js';
import setGuildActiveState from '../../../services/setGuildActiveState.js';
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

			await setGuildActiveState(guild.id, false);

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
