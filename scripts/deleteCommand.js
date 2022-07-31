import { REST } from '@discordjs/rest';
import commandLineArgs from 'command-line-args';
import { Routes } from 'discord.js';
import 'dotenv/config';
import { Listr } from 'listr2';

const optionDefinitions = [{ name: 'commandId', alias: 'c', type: String }];

const options = commandLineArgs(optionDefinitions);

const tasks = new Listr([
	{
		title: 'Deleting command',
		task: async (ctx, task) => {
			if (!options.commandId) throw new Error('Missing command id');

			const rest = new REST({ version: '10' }).setToken(
				process.env.DISCORD_FRENNY_AUTOMATE_BOT_TOKEN
			);

			await rest.delete(
				Routes.applicationGuildCommand(
					process.env.DISCORD_FRENNY_AUTOMATE_APP_ID,
					process.env.DISCORD_FRENNY_DEV_GUILD_ID,
					options.commandId
				)
			);

			task.title = 'Command deleted!';
		},
	},
]);

try {
	await tasks.run();
} catch (error) {
	// console.error(error);
}
