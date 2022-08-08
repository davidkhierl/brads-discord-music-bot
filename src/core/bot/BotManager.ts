import Bot from './Bot.js';
import chalk from 'chalk';
import { log } from 'console';
import { Collection } from 'discord.js';

export default class BotManager {
	/**
	 * BotManager instance
	 */
	private static instance: BotManager;

	/**
	 * Collection of registered bots
	 */
	public static bots = new Collection<string, Bot>();

	private constructor(...bots: Bot[]) {
		BotManager.setBotsCollection(bots);
	}

	/**
	 * Start all bots
	 */
	public start() {
		log(chalk.bgBlue.bold.white(' Starting Bots '));
		BotManager.bots.forEach((bot) => {
			bot.start();
		});
	}

	/**
	 * Create and initialize BotManager
	 * @returns Frenny class instance
	 */
	public static create(...bots: Bot[]): BotManager {
		if (!this.instance) {
			this.instance = new BotManager(...bots);
		}

		return this.instance;
	}

	/**
	 * Set bot collection
	 * @param bots Bot[]
	 */
	static setBotsCollection(bots: Bot[]) {
		for (const bot of bots) {
			if (bot.name) {
				BotManager.bots.set(bot.name, bot);
			}
		}
	}

	/**
	 * Deploy all bot commands
	 */
	public static async deployCommands() {
		if (!BotManager.bots.size) {
			log(chalk.blue('Deploying Commands'));
			console.error(chalk.redBright('[Failed]'), '0 bots instance found');
			return;
		}

		try {
			switch (process.env.DEPLOY_COMMANDS) {
				case 'guild':
					log(
						chalk.blue('Deploying Commands to Guild:'),
						process.env.DISCORD_DEVELOPMENT_GUILD_ID
					);

					if (process.env.NODE_ENV === 'production') {
						log(
							chalk.red(
								'[Failed]: Deploying commands to dev guild is not allowed in production'
							)
						);
					} else {
						BotManager.bots.forEach((bot) => {
							bot.deployCommandsToGuild(
								process.env.DISCORD_DEVELOPMENT_GUILD_ID
							)
								.then(() => {
									log(
										chalk.green('[Deployed Commands]:'),
										chalk.blue(bot.name)
									);
								})
								.catch((error) => {
									error instanceof Error &&
										console.log(error);
								});
						});
					}

					return;

				case 'global':
					if (process.env.NODE_ENV !== 'production') {
						console.log(
							'Deploying commands globally in development environment is not allowed'
						);
						return;
					}

					log(chalk.blue('Deploying Commands Globally'));

					BotManager.bots.forEach((bot) => {
						bot.deployCommandsGlobally().then(() => {
							log(
								chalk.green('[Deployed Commands]:'),
								chalk.blue(bot.name)
							);
						});
					});
					return;

				default:
					log(chalk.yellow('Skipped Commands Deployment'));
					return;
			}
		} catch (error) {
			console.log(error);
		}
	}
}

/**
 * BotManagerError
 */
export class BotManagerError extends Error {}
