import { BotEvent } from '../../../core/bot/Bot.js';
import saveBot from '../../../services/saveBot.js';
import chalk from 'chalk';
import { log } from 'console';
import { Client } from 'discord.js';

const ready: BotEvent<Client<true>> = {
	name: 'ready',
	once: true,
	execute: async (client) => {
		// add bot to database
		await saveBot(client.user);

		log(chalk.greenBright('[Ready]:'), chalk.blue(`${client.user.tag}`));
	},
};

// noinspection JSUnusedGlobalSymbols
export default ready;
