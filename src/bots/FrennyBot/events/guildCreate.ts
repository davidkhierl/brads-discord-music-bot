import { BotEvent } from '../../../core/bot/Bot.js';
import { BotEventError } from '../../../core/bot/BotEventError.js';
import SentryHelper from '../../../helpers/SentryHelper.js';
import saveGuild from '../../../services/saveGuild.js';
import saveGuildCommands from '../../../services/saveGuildCommands.js';
import saveGuildRoles from '../../../services/saveGuildRoles.js';
import { getFrennyBotInstance } from '../FrennyBot.js';
import * as Sentry from '@sentry/node';
import { Guild } from 'discord.js';

/**
 * Runs when bot joins a guild.
 * Saves all necessary guild data to the database and register commands to the guild
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

		if (!guild.available) throw new BotEventError('Guild not available');

		try {
			await saveGuild({ id: guild.id, name: guild.name, isActive: true });

			// filter only user created roles
			const roles = guild.roles.cache
				.filter((role) => !role.managed && role.name !== '@everyone')
				.toJSON();

			await saveGuildRoles(roles);

			const frenny = getFrennyBotInstance();

			const welcomeCommands = await frenny.deployCommandsToGuild(
				guild.id,
				{
					subDirectory: ['welcome'],
				}
			);

			await saveGuildCommands(
				welcomeCommands.map((command) => ({
					id: command.id,
					name: command.name,
					description: command.description,
					group: 'welcome',
					guildId: guild.id,
				}))
			);

			const musicCommands = await frenny.deployCommandsToGuild(guild.id, {
				subDirectory: ['music'],
			});

			await saveGuildCommands(
				musicCommands.map((command) => ({
					id: command.id,
					name: command.name,
					description: command.description,
					group: 'music',
					guildId: guild.id,
				}))
			);

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
