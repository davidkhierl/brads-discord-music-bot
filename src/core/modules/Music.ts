import BotModule from '../bot/BotModule.js';
import { Player } from 'discord-music-player';
import { Client } from 'discord.js';

/**
 * Music functionality for the bot
 */
export default class Music extends BotModule {
	public readonly player: Player;

	constructor(client: Client) {
		super(client);
		this.player = new Player(this.client);
	}

	/**
	 * Register all Player events
	 */
	private registerPlayerEvents() {
		this.player.on('songChanged', (queue, newSong, _oldSong) => {
			queue.data?.send(
				`🎶 | Now playing: **${newSong}** in **${queue.connection?.channel.name}**`
			);
		});
	}
}
