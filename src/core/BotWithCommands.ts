import SentryHelper from '../helpers/SentryHelper.js';
import BotCommandBuilder from './BotCommandBuilder.js';
import FrennyError from './FrennyError.js';
import { REST } from '@discordjs/rest';
import * as Sentry from '@sentry/node';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Client, ClientEvents, Collection, Guild, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

interface BotEventModule {
	name: keyof ClientEvents;
	once?: boolean;
	execute: (...args: any[]) => Promise<void>;
}

export interface BotEventClient extends BotEventModule {
	execute: (client: Client<true>) => Promise<void>;
}

export interface BotEventGuild extends BotEventModule {
	execute: (client: Guild) => Promise<void>;
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

		this.client.login(props.token);

		// TODO:
		// await prisma.bot.upsert({
		// 	where: { id: this.client.user.id },
		// 	update: { name: this.client.user.username },
		// 	create: {
		// 		id: this.client.user.id,
		// 		name: this.client.user.username,
		// 	},
		// 	select: { id: true },
		// });

		this.loadEvents();

		this.listenOnInteractionsCreate();
	}

	/**
	 * Load all events from bot events directory
	 * @returns void
	 */
	private async loadEvents() {
		if (!this.eventsDir) return;

		try {
			const eventFiles = fs
				.readdirSync(this.eventsDir)
				.filter((file) => file.match(/(\.[tj]s$)/g));

			Promise.all<void>(
				eventFiles.map(
					(file) =>
						new Promise((resolve, reject) => {
							(
								import(
									pathToFileURL(
										path.join(this.eventsDir!, file)
									).href
								) as Promise<{ default: BotEventModule }>
							)
								.then(({ default: event }) => {
									if (event.once) {
										this.client.once(
											event.name,
											(...args) => event.execute(...args)
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
		} catch (error) {
			if (error instanceof Error) console.error(error);
		}
	}

	/**
	 * Listen to all command interaction
	 */
	private listenOnInteractionsCreate() {
		this.client.on('interactionCreate', async (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			const command = this.commands.get(interaction.commandName);

			if (!command) return;

			try {
				// TODO: Convert SentryHelper to be used as decorator
				const transaction = SentryHelper.startCommandInteractionCreate(
					interaction,
					this.client
				);

				if (command.deferReply)
					await interaction.deferReply({
						ephemeral: command.ephemeral,
					});

				await command.execute(interaction);

				transaction.finish();
			} catch (error) {
				if (error instanceof Error) {
					await interaction.followUp(error.message);
					console.log(error);
				} else {
					// TODO: Decouple from sentry.
					Sentry.captureException(error);

					await interaction.reply({
						content:
							'There was an error while executing this command!',
						ephemeral: true,
					});

					console.log(
						'Something went wrong listening on interaction create'
					);
				}
			}
		});
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
