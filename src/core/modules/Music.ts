import { UserCommandError } from '../bot/Bot.js';
import BotModule from '../bot/BotModule.js';
import Embeds from '../components/Embeds.js';
import { Player, Queue } from 'discord-music-player';
import { ChatInputCommandInteraction, Client, GuildMember } from 'discord.js';

/**
 * Music functionality for the bot
 */
export default class Music extends BotModule {
	/**
	 * Player instance
	 */
	public readonly player: Player<ChatInputCommandInteraction>;

	/**
	 * Player queue
	 */
	private queue?: Queue;

	/**
	 * Player queue
	 */
	private guildQueue?: Queue;

	constructor(client: Client) {
		super(client);
		this.player = new Player(this.client);
		this.registerPlayerEvents();
	}

	/**
	 * Register all Player events
	 */
	private registerPlayerEvents() {
		this.player.on('songFirst', (queue, song) => {
			queue.data?.editReply({
				embeds: [
					Embeds.InfoMessage({
						title: `${song.name}`,
						thumbnail: { url: song.thumbnail },
						author: { name: 'Now playing' },
						url: song.url,
						footer: {
							text: `${song.author}`,
						},
						color: 0xf700ce,
					}),
				],
				content: '',
			});
		});
	}

	public init(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId || !interaction.guild)
			throw new MusicError('Cannot initialize without a guild');

		// if (!this.queue) {
		// 	this.queue = this.player.createQueue(interaction.guildId, {
		// 		data: interaction,
		// 	});
		// }

		const queue = this.player.createQueue(interaction.guildId, {
			data: interaction,
		});

		const guildQueue = this.player.getQueue(interaction.guildId);

		const member = interaction.guild.members.cache.get(interaction.user.id);

		if (!member)
			throw new MusicError(
				'Cannot find the member who invoked this interaction'
			);

		return {
			queue,
			guildQueue,
			member,
			join: () => this.joinVoiceChannel(member, queue),
		};
	}

	private async joinVoiceChannel(member: GuildMember, queue: Queue) {
		if (!member.voice.channel)
			throw new UserCommandError('🥱 Failed to join voice channel', {
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
