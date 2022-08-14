import { UserCommandError } from '../../bot/Bot.js';
import BotModule from '../../bot/BotModule.js';
import {
	channelEmpty,
	playerError,
	playlistAdd,
	queueDestroyed,
	queueEnd,
	songAdd,
	songChanged,
	songFirst,
} from './index.js';
import { Player, Queue } from 'discord-music-player';
import { ChatInputCommandInteraction, Client, GuildMember } from 'discord.js';

export type MusicQueue = Queue<PlayerData>;

export interface MusicInit {
	/**
	 * Player queue
	 */
	queue: MusicQueue;
	/**
	 * Guild queue
	 */
	guildQueue?: MusicQueue;
	/**
	 * Guild member
	 */
	member: GuildMember;
	/**
	 * Join the voice channel
	 */
	join: () => Promise<void>;
}

export interface PlayerData {
	interaction: ChatInputCommandInteraction;
}

/**
 * Music functionality for the bot
 */
export default class Music extends BotModule {
	/**
	 * Player instance
	 */
	public readonly player: Player<PlayerData>;

	constructor(client: Client<true>) {
		super(client);
		this.player = new Player(this.client);
		this.registerPlayerEvents();
	}

	/**
	 * Register all Player events
	 */
	private registerPlayerEvents() {
		this.player
			.on('songFirst', songFirst)
			.on('songAdd', songAdd)
			.on('playlistAdd', playlistAdd)
			.on('songChanged', songChanged)
			.on('queueEnd', queueEnd)
			.on('queueDestroyed', queueDestroyed)
			.on('channelEmpty', channelEmpty)
			.on('error', playerError);
	}

	/**
	 * Initialize the player
	 * @param interaction ChatInputCommandInteraction
	 * @returns The player object
	 */
	public init(interaction: ChatInputCommandInteraction): MusicInit {
		if (!interaction.guildId || !interaction.guild)
			throw new MusicError('Cannot initialize without a guild');

		const queue = this.player.createQueue(interaction.guildId, {
			data: { interaction },
		});

		const guildQueue = this.player.getQueue(interaction.guildId) as
			| Queue<PlayerData>
			| undefined;

		const member = interaction.guild.members.cache.get(interaction.user.id);

		if (!member)
			throw new MusicError(
				'Cannot find the member who invoked this interaction'
			);

		return {
			queue,
			guildQueue,
			member,
			join: async () => await this._joinVoiceChannel(member, queue),
		};
	}

	/**
	 * Join the voice channel
	 * @param member guild member invoke the command
	 * @param queue player queue
	 */
	private async _joinVoiceChannel(member: GuildMember, queue: Queue) {
		if (!member.voice.channel)
			throw new UserCommandError('🙄   Failed to join voice channel', {
				description: 'Make sure you are already in a voice channel',
			});

		await queue.join(member.voice.channel);
	}
}

/**
 * Music type guard
 * @param module BotModule
 * @returns boolean
 */
export function isMusic(module?: BotModule): module is Music {
	return module instanceof Music;
}

/**
 * Music Error
 */
export class MusicError extends Error {}
