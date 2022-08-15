import { BotEvent } from '../../../core/bot/Bot.js';
import { BotEventError } from '../../../core/bot/BotEventError.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import deleteGuildCommands from '../../../services/deleteGuildCommands.js';
import deleteGuildRoles from '../../../services/deleteGuildRoles.js';
import setGuildActiveState from '../../../services/setGuildActiveState.js';
import updateGuildDefaultRoleId from '../../../services/updateGuildDefaultRoleId.js';
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

		if (!guild.available) throw new BotEventError('Guild not available');

		try {
			await setGuildActiveState(guild.id, false);

			await updateGuildDefaultRoleId(guild.id, null);

			await deleteGuildCommands(guild.id);

			await deleteGuildRoles(guild.id);

			transaction.setStatus('ok');
		} catch (error) {
			console.log(error);

			transaction.setStatus('internal_error');

			Sentry.captureException(error);
		}

		SentryHelper.finishTransaction(transaction);
	},
};

// noinspection JSUnusedGlobalSymbols
export default guildCreate;
