import SentryHelper from '../../helpers/SentryHelper.js';
import MessageEmbeds, {
	EmbedContent,
	MESSAGE_EMBED_COLORS,
} from '../components/MessageEmbeds.js';
import BotCommandBuilder from './BotCommandBuilder.js';
import BotModule from './BotModule.js';
import { REST } from '@discordjs/rest';
import * as Sentry from '@sentry/node';
import {
	RESTPostAPIApplicationCommandsJSONBody,
	RESTPostAPIApplicationGuildCommandsResult,
} from 'discord-api-types/v10';
import {
	ChatInputCommandInteraction,
	Client,
	ClientEvents,
	Collection,
	Routes,
} from 'discord.js';
import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Class } from 'type-fest';

export interface BotEventModule {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Promise<void>;
}

export interface BotEvent<T> extends BotEventModule {
	execute: (args: T) => Promise<void>;
}

export interface CommandsDirOptions {
	subDirectory?: string[];
}

export interface BotConstructor {
	client: Client<true>;
	commandsDir: string;
	eventsDir?: string;
	token: string;
	appId: string;
}

export default class Bot {
	/**
	 * Bot name
	 */
	public name = Bot.name;

	/**
	 * Bot client
	 */
	public readonly client: Client<true>;

	/**
	 * App ID
	 */
	private readonly appId: string;

	/**
	 * Bot token
	 */
	private readonly token: string;

	/**
	 * Bot commands collection
	 */
	private readonly commands: Collection<string, BotCommandBuilder>;

	/**
	 * Bot commands directory path
	 */
	private readonly commandsDir: string;

	/**
	 * Bot commands directory path
	 */
	private readonly eventsDir?: string;

	/**
	 * Bot REST instance
	 */
	private readonly rest: REST;

	/**
	 * Bot module collection
	 */
	readonly modules: Collection<string, BotModule>;

	constructor(props: BotConstructor) {
		this.client = props.client;

		this.appId = props.appId;

		this.commands = new Collection();

		this.commandsDir = props.commandsDir;

		this.eventsDir = props.eventsDir;

		this.setCommandsCollection();

		this.rest = new REST({ version: '10' }).setToken(props.token);

		this.token = props.token;

		this.modules = new Collection();
	}

	/**
	 * Start the bot
	 */
	public start() {
		this.client.login(this.token);

		this._initializeEvents().then(() =>
			console.log(`${this.name} event initialize`)
		);

		this._listenOnCommandChatInput();
	}

	/**
	 * Reply error message to user
	 * @param interaction ChatInputCommandInteraction
	 * @param options Reply options
	 */
	private async _replyErrorMessage(
		interaction: ChatInputCommandInteraction,
		options?: { deferReply?: boolean } & Partial<EmbedContent>
	) {
		if (options?.deferReply)
			await interaction.followUp({
				ephemeral: true,
				embeds: [MessageEmbeds.Error({ ...options })],
				content: '',
			});
		else
			await interaction.reply({
				ephemeral: true,
				embeds: [MessageEmbeds.Error({ ...options })],
				content: '',
			});
	}

	/**
	 * Load all events from bot events directory
	 * @returns void
	 */
	private async _initializeEvents() {
		if (!this.eventsDir) return;

		// read event files
		const eventFiles = fs
			.readdirSync(this.eventsDir)
			.filter((file) => file.match(/(\.[tj]s$)/g));

		return Promise.all<void>(
			eventFiles.map(
				(file) =>
					new Promise((resolve, reject) => {
						(
							import(
								pathToFileURL(path.join(this.eventsDir!, file))
									.href
							) as Promise<{ default: BotEventModule }>
						)
							.then(({ default: event }) => {
								// execute events
								if (event.once) {
									this.client.once(event.name, (...args) =>
										event
											.execute(...args)
											.catch((error) => {
												console.log(error);

												Sentry.captureException(error);
											})
									);
								} else {
									this.client.on(event.name, (...args) =>
										event
											.execute(...args)
											.catch((error) => {
												console.log(error);

												Sentry.captureException(error);
											})
									);
								}
								resolve();
							})
							.catch((reason) => reject(reason));
					})
			)
		);
	}

	/**
	 * Listen to all command interaction
	 */
	private _listenOnCommandChatInput() {
		this.client.on('interactionCreate', async (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			// retrieve command
			const command = this.commands.get(interaction.commandName);

			if (!command) return;

			// start sentry transaction
			const transaction = SentryHelper.startBotCommandTransaction({
				op: interaction.commandName,
				bot: interaction.client.user?.username,
				user: {
					id: interaction.user.id,
					username: interaction.user.username,
				},
			});

			Sentry.setContext('guild', {
				id: interaction.guild?.id,
				name: interaction.guild?.name,
			});

			try {
				// defer reply
				if (command.deferReply)
					await interaction.deferReply({
						ephemeral: command.ephemeral,
					});

				// execute command
				await command.execute(interaction, this);

				// finish sentry transaction
				transaction.setStatus('ok');
			} catch (error) {
				// reply to user if it's a user command error
				if (error instanceof UserCommandError) {
					await this._replyErrorMessage(interaction, {
						deferReply: command.deferReply,
						title: error.message,
						description: error.description,
						color: MESSAGE_EMBED_COLORS.warning,
					});

					return;
				}

				if (error instanceof Error) {
					// reply a generic error message to user
					await this._replyErrorMessage(interaction, {
						deferReply: command.deferReply,
					});
					console.log(error);
				}

				transaction.setStatus('internal_error');

				// capture sentry error
				Sentry.captureException(error);
			}

			SentryHelper.finishTransaction(transaction);
		});
	}

	/**
	 * Read all commands from the bot commands directory
	 * @param options CommandsDirOptions
	 * @private Array of BotCommands instance
	 */
	private async getAllCommandsInstance(options?: CommandsDirOptions) {
		try {
			const commandFiles = fg.sync('**/*.(t|j)s', {
				absolute: true,
				cwd: path.join(
					this.commandsDir,
					...(options?.subDirectory ?? '')
				),
			});

			if (!commandFiles.length) return;

			return Promise.all(
				commandFiles.map(
					(file) =>
						new Promise<BotCommandBuilder>((resolve, reject) => {
							(
								import(pathToFileURL(file).href) as Promise<{
									default: typeof BotCommandBuilder;
								}>
							)
								.then(({ default: botCommandBuilder }) => {
									resolve(new botCommandBuilder());
								})
								.catch((reason) => reject(reason));
						})
				)
			);
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
			}

			return;
		}
	}

	/**
	 * Set commands collections
	 */
	private setCommandsCollection() {
		this.getAllCommandsInstance().then((commands) => {
			if (commands?.length) {
				for (const command of commands) {
					this.commands.set(command.slash.name, command);
				}
			}
		});
	}

	/**
	 * Get all final commands ready to send to Discord
	 * @param options CommandsDirOptions
	 * @returns Returns the final data that should be sent to Discord.
	 */
	private async getAllCommandsToJSON(
		options?: CommandsDirOptions
	): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
		const commands = await this.getAllCommandsInstance(options);

		if (!commands)
			throw new BotError(
				`No commands found: ${path.join(
					this.commandsDir,
					...(options?.subDirectory ?? '')
				)}`
			);

		return commands.map((command) => command.slash.toJSON());
	}

	/**
	 * Deploy the bot commands to a guild
	 * @param guildId The guild id to deploy the commands to
	 * @param options CommandsDirOptions
	 */
	public async deployCommandsToGuild(
		guildId: string,
		options?: CommandsDirOptions
	) {
		const commands = await this.getAllCommandsToJSON(options);

		return Promise.all(
			commands.map(
				(command) =>
					this.rest.post(
						Routes.applicationGuildCommands(this.appId, guildId),
						{
							body: command,
						}
					) as Promise<RESTPostAPIApplicationGuildCommandsResult>
			)
		);
	}

	/**
	 * Deploy the bot commands globally
	 */
	public async deployCommandsGlobally(options?: CommandsDirOptions) {
		const commands = await this.getAllCommandsToJSON(options);

		return this.rest.put(Routes.applicationCommands(this.appId), {
			body: commands,
		});
	}

	/**
	 * Delete guild command
	 * @param guildId Guild ID
	 * @param commandId Command ID
	 * @returns Promise<unknown>
	 */
	public async deleteGuildCommand(guildId: string, commandId: string) {
		return this.rest.delete(
			Routes.applicationGuildCommand(this.appId, guildId, commandId)
		);
	}

	/**
	 * Register a bot module
	 * @param modules BotModule
	 */
	public registerModules(...modules: Class<BotModule, [Client<true>]>[]) {
		modules.forEach((module) => {
			this.modules.set(
				module.name.toLowerCase(),
				new module(this.client)
			);
		});
	}
}
/**
 * Bot error
 */
export class BotError extends Error {}

export interface UserCommandErrorOptions {
	description?: string;
	color?: number;
}

/**
 * Error caused by user initiating commands
 */
export class UserCommandError extends Error {
	public description?: string;
	public color?: number;
	constructor(message?: string, options?: UserCommandErrorOptions) {
		super(message);
		this.description = options?.description;
		this.color = options?.color;
	}
}

/**
 * Error related to a bot event
 */
export class BotEventError extends Error {}
