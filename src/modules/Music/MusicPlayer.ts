import { Player } from 'discord-music-player';
import Bot from '../../bot/Bot';

export default class MusicPlayer {
	private static instance: MusicPlayer;

	readonly player: Player;

	private bot: Bot;

	private constructor() {
		this.bot = Bot.getInstance();

		this.player = new Player(this.bot.client, {
			timeout: 1,
		});
	}

	public static getInstance(): MusicPlayer {
		if (!MusicPlayer.instance) {
			MusicPlayer.instance = new MusicPlayer();
		}

		return MusicPlayer.instance;
	}

	public static getPlayer(): Player {
		return MusicPlayer.getInstance().player;
	}
}
