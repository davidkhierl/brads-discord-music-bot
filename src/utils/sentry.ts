import * as Sentry from '@sentry/node';
import { Transaction } from '@sentry/types';
import { CommandContext } from 'slash-create';
import { capitalize } from 'lodash';

export const startCommandTransaction = (
	ctx: CommandContext,
	moduleName?: string
): Transaction => {
	const transaction = Sentry.startTransaction({
		name: `${moduleName ? capitalize(moduleName) + ' ' : ''}"${
			ctx.commandName
		}" command`,
		op: 'command',
		tags: {
			module: 'music',
		},
	});

	Sentry.configureScope((scope) => scope.setSpan(transaction));

	Sentry.setContext(ctx.commandName, {
		song: ctx.options.song,
	});

	Sentry.setUser({
		id: ctx.user.id,
		username: ctx.user.username,
	});

	return transaction;
};
