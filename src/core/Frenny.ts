import BotWithCommands from './BotWithCommands.js';
import FrennyError from './FrennyError.js';
import chalk from 'chalk';
import { log } from 'console';
import { Collection } from 'discord.js';

export default class Frenny {
	/**
	 * Frenny instance
	 */
	private static instance: Frenny;

	/**
	 * Collection of registered bots
	 */
	public static bots = new Collection<string, BotWithCommands>();

	private constructor(...bots: BotWithCommands[]) {
		log(chalk.bgBlue.bold.white(' Starting Frenny Bots '));
		this.setBotsCollection(bots);
	}

	/**
	 * Create and initialize Frenny
	 * @returns Frenny class instance
	 */
	public static create(...bots: BotWithCommands[]): Frenny {
		if (!this.instance) {
			this.instance = new Frenny(...bots);
		}

		return this.instance;
	}

	/**
	 * Set bot collection
	 * @param bots BotWithCommands[]
	 */
	private setBotsCollection(bots: BotWithCommands[]) {
		for (const bot of bots) {
			if (bot.name) {
				Frenny.bots.set(bot.name, bot);
			}
		}
	}

	/**
	 * Deploy all bot commands
	 */
	public static deployCommands() {
		if (!Frenny.bots.size) {
			log(chalk.blue('Deploying Commands'));
			console.error(chalk.redBright('[Failed]'), '0 bots instance found');
			return;
		}

		switch (process.env.DEPLOY_COMMANDS) {
			case 'guild':
				log(
					chalk.blue('Deploying Commands to Guild:'),
					process.env.DISCORD_FRENNY_DEV_GUILD_ID
				);
				Frenny.bots.forEach((bot) => {
					bot.deployCommandsToGuild(
						process.env.DISCORD_FRENNY_DEV_GUILD_ID
					)
						.then(() => {
							log(
								chalk.green('[Deployed]:'),
								chalk.blue(bot.name)
							);
						})
						.catch((reason) => {
							if (reason instanceof Error)
								throw new FrennyError(reason.message, reason);
						});
				});
				return;

			case 'global':
				// TODO
				console.log(
					chalk.yellow(
						'Global commands deployment not yet implemented'
					)
				);
				return;

			default:
				log(chalk.yellow('Skipped Commands Deployment'));
				return;
		}
	}
}
