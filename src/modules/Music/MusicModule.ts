import { Player, Queue } from 'discord-music-player';
import { GuildBasedChannel } from 'discord.js';
import BradsModule from '../../brads/BradsModule';
import MusicPlayer from './MusicPlayer';

export interface MusicQueue extends Queue {
	data: GuildBasedChannel;
}

export default class MusicModule extends BradsModule {
	readonly player: Player;

	constructor() {
		super();

		this.player = MusicPlayer.getPlayer();
	}

	private registerPlayerEvents() {
		this.player
			// Emitted when channel was empty.
			.on('channelEmpty', (queue) => {
				console.log(queue.data);
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
					`😔 **${this.bot.client.user?.username}** was kicked from the voice channel, queue ended.`
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

	register(): void {
		this.registerPlayerEvents();
	}
}
