import * as Sentry from '@sentry/node';
import { Transaction } from '@sentry/types';
import { Client, CommandInteraction, Interaction } from 'discord.js';

export default class SentryHelper {
	public static startCommandInteractionCreate(
		interaction: CommandInteraction,
		client: Client
	): Transaction {
		const transaction = Sentry.startTransaction({
			name: `${client.user?.username} [${interaction.commandName}] command`,
			op: 'command',
			tags: {
				bot: client.user?.username,
			},
		});

		Sentry.configureScope((scope) => scope.setSpan(transaction));

		Sentry.setUser({
			id: interaction.user.id,
			username: interaction.user.username,
		});

		return transaction;
	}
}
