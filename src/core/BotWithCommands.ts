import SentryHelper from '../helpers/SentryHelper.js';
import BotCommandBuilder from './BotCommandBuilder.js';
import { FrennyError } from './Frenny.js';
import { REST } from '@discordjs/rest';
import * as Sentry from '@sentry/node';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import {
	ChatInputCommandInteraction,
	Client,
	ClientEvents,
	Collection,
	Routes,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export interface BotEventModule {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Promise<void>;
}

export interface BotEvent<T> extends BotEventModule {
	execute: (args: T) => Promise<void>;
}

export interface BotWithCommandsConstructor {
	client: Client;
	commandsDir: string;
	eventsDir?: string;
	token: string;
	appId: string;
}

export default class BotWithCommands {
	/**
	 * Bot name
	 */
	public name = BotWithCommands.name;

	/**
	 * Bot client
	 */
	public readonly client: Client<boolean>;

	/**
	 * App Id
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

	constructor(props: BotWithCommandsConstructor) {
		this.client = props.client;

		this.appId = props.appId;

		this.commands = new Collection();

		this.commandsDir = props.commandsDir;

		this.eventsDir = props.eventsDir;

		this.setCommandsCollection();

		this.rest = new REST({ version: '10' }).setToken(props.token);

		this.token = props.token;
	}

	/**
	 * Start the bot
	 */
	public start() {
		this.client.login(this.token);

		this.initializeEvents();

		this.listenOnCommandChatInput();
	}

	/**
	 * Reply error message to user
	 * @param interaction ChatInputCommandInteraction
	 * @param options Reply options
	 */
	private async replyErrorMessage(
		interaction: ChatInputCommandInteraction,
		options?: { message?: string; deferReply?: boolean }
	) {
		const errorMessage =
			options?.message ??
			'Sorry there was an error executing this command';

		if (options?.deferReply)
			await interaction.followUp({
				ephemeral: true,
				content: errorMessage,
			});
		else
			await interaction.reply({
				ephemeral: true,
				content: errorMessage,
			});
	}

	/**
	 * Load all events from bot events directory
	 * @returns void
	 */
	private async initializeEvents() {
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
										event.execute(...args)
									);
								} else {
									this.client.on(event.name, (...args) =>
										event.execute(...args)
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
	private listenOnCommandChatInput() {
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
				await command.execute(interaction);

				// finish sentry transaction
				transaction.setStatus('ok');
			} catch (error) {
				// reply to user if its an user command error
				if (error instanceof UserCommandError) {
					this.replyErrorMessage(interaction, {
						deferReply: command.deferReply,
						message: error.message,
					});
				}

				if (error instanceof Error) {
					// reply a generic error message to user
					this.replyErrorMessage(interaction, {
						deferReply: command.deferReply,
					});
					console.log(error);
				}

				transaction.setStatus('internal_error');

				// capture sentry error
				Sentry.captureException(error);
			}

			transaction.finish();
		});
	}

	/**
	 * Read all commands from the bot commands directory
	 * @returns Array of BotCommands instance
	 */
	private async getAllCommandsInstance() {
		try {
			const commandFiles = fs
				.readdirSync(this.commandsDir)
				.filter((file) => file.match(/(\.[tj]s$)/g));

			if (!commandFiles) return;

			return Promise.all(
				commandFiles.map(
					(file) =>
						new Promise<BotCommandBuilder>((resolve, reject) => {
							(
								import(
									pathToFileURL(
										path.join(this.commandsDir, file)
									).href
								) as Promise<{
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
	private async setCommandsCollection() {
		const commands = await this.getAllCommandsInstance();

		if (commands) {
			for (const command of commands) {
				this.commands.set(command.slash.name, command);
			}
		}
	}

	/**
	 * Get all final commands ready to send to Discord
	 * @returns Returns the final data that should be sent to Discord.
	 */
	private async getAllCommandsToJSON(): Promise<
		RESTPostAPIApplicationCommandsJSONBody[] | undefined
	> {
		const commands = await this.getAllCommandsInstance();

		if (!commands) return;

		return commands.map((command) => command.slash.toJSON());
	}

	/**
	 * Deploy the bot commands to a guild
	 * @param guildId The guild id to deploy the commands to
	 */
	public async deployCommandsToGuild(guildId: string) {
		const commands = await this.getAllCommandsToJSON();

		if (!commands) throw new FrennyError('No Commands Found');

		return this.rest.put(
			Routes.applicationGuildCommands(this.appId, guildId),
			{
				body: commands,
			}
		);
	}

	/**
	 * Deploy the bot commands globally
	 */
	public async deployCommandsGlobally() {
		const commands = await this.getAllCommandsToJSON();

		if (!commands) throw new FrennyError('No Commands Found');

		return this.rest.put(Routes.applicationCommands(this.appId), {
			body: commands,
		});
	}
}

/**
 * BotWithCommands error
 */
export class BotWithCommandsError extends Error {}

/**
 * Error caused by user initiating commands
 */
export class UserCommandError extends Error {}

/**
 * Error related to a bot event
 */
export class BotEventError extends Error {}
