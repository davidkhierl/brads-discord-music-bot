import BotWithCommands from './BotWithCommands.js';
import FrennyError from './FrennyError.js';
import Spinnies from '@trufflesuite/spinnies';
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

	/**
	 * Spinner
	 */
	// @ts-ignore
	public static readonly spinner = new Spinnies();

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
				Frenny.spinner.add(bot.name, {
					text: `Starting ${bot.name}`,
				});
			}
		}
	}

	/**
	 * Deploy all bot commands
	 */
	public static deployCommands() {
		if (!Frenny.bots.size) {
			console.error(
				chalk.bgRed.bold.white(' Deploy Commands Failed '),
				'0 bots instance found'
			);
			return;
		}

		Frenny.bots.forEach((bot) => {
			Frenny.spinner.add(`${bot.name} deploy commands`, {
				text: `Deploy ${bot.name} commands to guild ${process.env.DISCORD_FRENNY_DEV_GUILD_ID}`,
			});

			switch (process.env.DEPLOY_COMMANDS) {
				case 'guild':
					bot.deployCommandsToGuild(
						process.env.DISCORD_FRENNY_DEV_GUILD_ID
					)
						.then(() => {
							Frenny.spinner.succeed(
								`${bot.name} deploy commands`,
								{
									text: `Deploy ${bot.name} commands to guild ${process.env.DISCORD_FRENNY_DEV_GUILD_ID}`,
									textColor: 'blue',
									prefixColor: 'green',
								}
							);
						})
						.catch((reason) => {
							if (reason instanceof Error)
								throw new FrennyError(reason.message, reason);
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
					Frenny.spinner.warn(`${bot.name} deploy commands`, {
						text: `Skipped deploy ${bot.name} commands`,
						textColor: 'yellow',
						prefixColor: 'yellow',
						indent: 2,
					});
					return;
			}
		});
	}
}
