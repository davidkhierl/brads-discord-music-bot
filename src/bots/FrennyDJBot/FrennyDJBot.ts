import BotWithCommands from '../../core/BotWithCommands.js';
import Frenny from '../../core/Frenny.js';
import dirResolver from '../../helpers/dirResolver.js';
import { Player } from 'discord-music-player';
import { Client, IntentsBitField, TextChannel } from 'discord.js';

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
export default class FrennyDJBot extends BotWithCommands {
	/**
	 * Frenny DJ Player instance
	 */
	public static player: Player<TextChannel>;

	constructor() {
		super({
			client: new Client({
				intents: [
					IntentsBitField.Flags.Guilds,
					IntentsBitField.Flags.GuildMessages,
					IntentsBitField.Flags.GuildVoiceStates,
				],
			}),
			commandsDir: dirResolver(import.meta.url, 'commands'),
			eventsDir: dirResolver(import.meta.url, 'events'),
			token: process.env.DISCORD_FRENNY_DJ_BOT_TOKEN,
			appId: process.env.DISCORD_FRENNY_DJ_APP_ID,
		});

		this.name = FrennyDJBot.name;

		FrennyDJBot.player = new Player<TextChannel>(this.client, {
			timeout: 10,
		});

		// this.listenOnInteractionCreate();

		this.registerPlayerEvents();
	}

	// private listenOnInteractionCreate() {
	// 	this.client.on('interactionCreate', async (interaction) => {
	// 		if (!interaction.isChatInputCommand()) return;

	// 		const command = this.commands.get(interaction.commandName);

	// 		if (!command) return;

	// 		try {
	// 			const transaction = SentryHelper.startCommandInteractionCreate(
	// 				interaction,
	// 				this.client
	// 			);

	// 			await interaction.deferReply({ ephemeral: true });

	// 			await command.execute(interaction);

	// 			transaction.finish();
	// 		} catch (error) {
	// 			if (
	// 				error instanceof UserCommandError ||
	// 				error instanceof DMPError
	// 			) {
	// 				await interaction.followUp(error.message);
	// 			} else {
	// 				Sentry.captureException(error);

	// 				await interaction.followUp({
	// 					content:
	// 						'😵 | There was a problem while executing this command!',
	// 				});

	// 				console.error(error);
	// 			}
	// 		}
	// 	});
	// }

	/**
	 * Register all Player events
	 */
	private registerPlayerEvents() {
		FrennyDJBot.player
			// Emitted when channel was empty.
			.on('channelEmpty', (queue) => {
				queue.data?.send(
					'😴💤💤💤 Everyone left the voice channel, ending queue. Bye Frennies! 👋'
				);
			})
			// Emitted when a song was added to the queue.
			.on('songAdd', (queue, song) => {
				if (!song.isFirst)
					queue.data?.send(`✔️ | Added to queue **${song}**`);
			})
			// Emitted when a playlist was added to the queue.
			.on('playlistAdd', (queue, playlist) => {
				queue.data?.send(
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
				queue.data?.send('🥳 | Queue finished!');
			})
			// Emitted when a song changed.
			.on('songChanged', (queue, newSong, _oldSong) => {
				queue.data?.send(
					`🎶 | Now playing: **${newSong}** in **${queue.connection?.channel.name}**`
				);
			})
			// Emitted when a first song in the queue started playing.
			.on('songFirst', (queue, song) => {
				queue.data?.send(
					`🎶 | Started playing: **${song}** in **${queue.connection?.channel.name}**`
				);
			})
			// Emitted when someone disconnected the bot from the channel.
			.on('clientDisconnect', (queue) => {
				queue.data?.send(
					`😔 **${this.client.user?.username}** was kicked from the voice channel, queue ended.`
				);
			})
			// Emitted when deafenOnJoin is true and the bot was undeafened
			.on('clientUndeafen', (_queue) => console.log('I got undefeanded.'))
			// Emitted when there was an error in runtime
			.on('error', (error, queue) => {
				queue.data?.send(
					`☠️ | Oops.. something went wrong. **Error: ${error}**`
				);
				console.log(`Error: ${error} in ${queue.guild.name}`);
			});
	}
}

/**
 * FrennyDJBot type guard
 * @param bot BotWithCommands
 * @returns boolean
 */
export function isFrennyDJBot(bot?: BotWithCommands): bot is FrennyDJBot {
	return bot instanceof FrennyDJBot;
}

/**
 * Get instance of FrennyDJBot from Frenny bots collection
 * @param frenny Frenny
 * @returns instance of FrennyDJBot
 */
export function getFrennyDJBotInstance(): FrennyDJBot {
	const instance = Frenny.bots.get(FrennyDJBot.name);

	if (!isFrennyDJBot(instance))
		throw new Error('No Instance of FrennyDJBot Found');

	return instance;
}
