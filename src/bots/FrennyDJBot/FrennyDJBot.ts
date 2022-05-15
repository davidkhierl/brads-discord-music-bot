import BotCommands from '../../lib/BotCommands';
import SentryHelper from '../../lib/SentryHelper';
import UserCommandError from '../../utils/UserCommandError';
import { REST } from '@discordjs/rest';
import * as Sentry from '@sentry/node';
import {
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from 'discord-api-types/v9';
import { DMPError, Player } from 'discord-music-player';
import { Client, Collection, Intents } from 'discord.js';
import fs from 'fs';
import path from 'path';

/**
 * Frenny DJ Bot, This bot add music commands
 * to play music from YouTube.
 *
 * @remarks
 *
 * Currently it uses YouTube to play music, Other
 * streaming platform will be added soon like
 * Spotify.
 */
export default class FrennyDJBot {
	/**
	 * Frenny DJ Bot instance
	 */
	private static instance: FrennyDJBot;

	/**
	 * Frenny DJ Bot client
	 */
	readonly client: Client<boolean>;

	/**
	 * Frenny DJ Bot commands collection
	 */
	readonly commands: Collection<string, BotCommands>;

	/**
	 * Frenny DJ Bot commands directory path
	 */
	static readonly commandsDir = path.join(__dirname, 'commands');

	/**
	 * Frenny DJ Bot REST instance
	 */
	private static readonly rest = new REST({ version: '9' }).setToken(
		process.env.DISCORD_FRENNY_DJ_BOT_TOKEN
	);

	/**
	 * Frenny DJ Player instance
	 */
	readonly player: Player;

	private constructor() {
		this.client = new Client({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES,
			],
		});
		this.client.login(process.env.DISCORD_FRENNY_DJ_BOT_TOKEN);
		this.commands = new Collection();
		this.setCommandsCollection();
		this.listenOnInteractionCreate();
		this.player = new Player(this.client, { timeout: 10 });
		this.registerPlayerEvents();
	}
	/**
	 * Set commands collections
	 */
	private setCommandsCollection() {
		const commands = FrennyDJBot.getAllCommandsInstance();

		for (const command of commands) {
			this.commands.set(command.slash.name, command);
		}
	}

	private listenOnInteractionCreate() {
		this.client.on('interactionCreate', async (interaction) => {
			// TODO: Accept button command
			if (!interaction.isCommand()) return;

			const command = this.commands.get(interaction.commandName);

			if (!command) return;

			try {
				const transaction = SentryHelper.startCommandInteractionCreate(
					interaction,
					this.client
				);

				await interaction.deferReply({ ephemeral: true });

				await command.execute(interaction);

				transaction.finish();
			} catch (error) {
				if (
					error instanceof UserCommandError ||
					error instanceof DMPError
				) {
					await interaction.followUp(error.message);
				} else {
					Sentry.captureException(error);

					await interaction.followUp({
						content:
							'😵 | There was a problem while executing this command!',
					});

					console.error(error);
				}
			}
		});
	}

	/**
	 * Register all Player events
	 */
	private registerPlayerEvents() {
		this.player
			// Emitted when channel was empty.
			.on('channelEmpty', (queue) => {
				queue.data.send(
					'😴💤💤💤 Everyone left the voice channel, ending queue. Bye Frennies! 👋'
				);
			})
			// Emitted when a song was added to the queue.
			.on('songAdd', (queue, song) => {
				if (!song.isFirst)
					queue.data.send(`✔️ | Added to queue **${song}**`);
			})
			// Emitted when a playlist was added to the queue.
			.on('playlistAdd', (queue, playlist) => {
				queue.data.send(
					`💿 | Playlist: **${playlist}** with 🎶 **${playlist.songs.length} songs** added to the queue in **${queue.connection?.channel.name}**`
				);
			})
			// Emitted when there was no more music to play.
			// TODO: queue destroyed
			.on('queueDestroyed', (_queue) =>
				console.log('The queue was destroyed.')
			)
			// Emitted when the queue was destroyed (either by ending or stopping).
			.on('queueEnd', (queue) => {
				queue.data.send('🥳 | Queue finished!');
			})
			// Emitted when a song changed.
			.on('songChanged', (queue, newSong, _oldSong) => {
				queue.data.send(
					`🎶 | Now playing: **${newSong}** in **${queue.connection?.channel.name}**`
				);
			})
			// Emitted when a first song in the queue started playing.
			.on('songFirst', (queue, song) => {
				queue.data.send(
					`🎶 | Started playing: **${song}** in **${queue.connection?.channel.name}**`
				);
			})
			// Emitted when someone disconnected the bot from the channel.
			.on('clientDisconnect', (queue) => {
				queue.data.send(
					`😔 **${this.client.user?.username}** was kicked from the voice channel, queue ended.`
				);
			})
			// Emitted when deafenOnJoin is true and the bot was undeafened
			.on('clientUndeafen', (_queue) => console.log('I got undefeanded.'))
			// Emitted when there was an error in runtime
			.on('error', (error, queue) => {
				queue.data.send(
					`☠️ | Oops.. something went wrong. **Error: ${error}**`
				);
				console.log(`Error: ${error} in ${queue.guild.name}`);
			});
	}

	/**
	 * Read all commands from the bot commands directory
	 * @returns Array of BotCommands instance
	 */
	public static getAllCommandsInstance() {
		const commandFiles = fs
			.readdirSync(FrennyDJBot.commandsDir)
			.filter((file) => file.match(/(\.[tj]s$)/g));

		return commandFiles.map(
			(file) =>
				new (require(path.join(
					FrennyDJBot.commandsDir,
					file
				)).default)() as BotCommands
		);
	}

	/**
	 * Deploy the bot commands to a guild
	 * @param guildId The guild id to deploy the commands to
	 */
	public static async deployCommandsToGuild(
		guildId: string,
		callback?: () => void
	) {
		const commands = FrennyDJBot.getAllCommandsToJSON();

		FrennyDJBot.rest
			.put(
				Routes.applicationGuildCommands(
					process.env.DISCORD_FRENNY_DJ_APP_ID,
					guildId
				),
				{
					body: commands,
				}
			)
			.then(callback)
			.catch(console.error);
	}

	/**
	 * Deploy the bot commands to a globally
	 * @param guildId The guild id to deploy the commands to
	 */
	public static async deployCommandsGlobally(callback?: () => void) {
		const commands = FrennyDJBot.getAllCommandsToJSON();

		FrennyDJBot.rest
			.put(
				Routes.applicationCommands(
					process.env.DISCORD_FRENNY_DJ_APP_ID
				),
				{
					body: commands,
				}
			)
			.then(callback)
			.catch(console.error);
	}

	/**
	 * Get all final commands ready to send to Discord
	 * @returns Returns the final data that should be sent to Discord.
	 */
	public static getAllCommandsToJSON(): RESTPostAPIApplicationCommandsJSONBody[] {
		return FrennyDJBot.getAllCommandsInstance().map((command) =>
			command.slash.toJSON()
		);
	}

	/**
	 * Get FrennyDJBot instance
	 * @returns Frenny DJ Bot class instance
	 */
	public static getInstance(): FrennyDJBot {
		if (!this.instance) {
			this.instance = new FrennyDJBot();
		}

		return this.instance;
	}

	/**
	 * Get Frenny DJ Bot client instance
	 * @returns Frenny DJ Bot client instance
	 */
	public static getClient(): Client<boolean> {
		return FrennyDJBot.getInstance().client;
	}

	/**
	 * Get Frenny DJ Bot Player instance
	 * @returns Player instance
	 */
	public static getPlayer(): Player {
		return FrennyDJBot.getInstance().player;
	}
}
