import { BotEvent } from '../../../core/BotWithCommands.js';
import chalk from 'chalk';
import { log } from 'console';

const ready: BotEvent = {
	name: 'ready',
	once: true,
	execute(client) {
		log(chalk.greenBright('[Ready]:'), chalk.blue(`${client.user.tag}`));
	},
};

export default ready;
