import { UserCommandError } from '../bot/Bot.js';
import BotModule from '../bot/BotModule.js';
import MessageEmbeds from '../components/MessageEmbeds.js';
import { Player, Queue } from 'discord-music-player';
import { ChatInputCommandInteraction, Client, GuildMember } from 'discord.js';

export interface MusicInit {
	/**
	 * Player queue
	 */
	queue: Queue<PlayerData>;
	/**
	 * Guild queue
	 */
	guildQueue?: Queue<PlayerData>;
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

	constructor(client: Client) {
		super(client);
		this.player = new Player(this.client);
		this.registerPlayerEvents();
	}

	/**
	 * Register all Player events
	 */
	private registerPlayerEvents() {
		this.player
			.on('songFirst', (queue, song) => {
				song.data?.interaction.editReply({
					embeds: [
						MessageEmbeds.Info({
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
			})
			.on('songAdd', async (queue, song) => {
				if (song.isFirst) return;

				song.data?.interaction.editReply({
					embeds: [
						MessageEmbeds.Info({
							title: `${song.name}`,
							thumbnail: { url: song.thumbnail },
							author: { name: 'Song added to the queue' },
							url: song.url,
							footer: {
								text: `${song.author}`,
							},
						}),
					],
				});
			})
			.on('songChanged', (queue, newSong) => {
				newSong.data?.interaction.followUp({
					embeds: [
						MessageEmbeds.Info({
							title: `${newSong.name}`,
							thumbnail: { url: newSong.thumbnail },
							author: { name: 'Now playing' },
							url: newSong.url,
							footer: {
								text: `Added by: ${
									newSong.requestedBy?.id ===
									newSong.data?.interaction.user.id
										? 'You'
										: newSong.requestedBy?.username
								}`,
								iconURL: newSong.requestedBy?.displayAvatarURL({
									size: 16,
								}),
							},
							color: 0xf700ce,
						}),
					],
					content: '',
					ephemeral: true,
				});
			})
			.on('queueEnd', (queue) => {
				queue.data?.interaction.followUp({
					embeds: [
						MessageEmbeds.Success({
							title: 'Songs queue ended',
						}),
					],
				});
			});
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
			join: async () => await this.joinVoiceChannel(member, queue),
		};
	}

	/**
	 * Join the voice channel
	 * @param member guild member invoke the command
	 * @param queue player queue
	 */
	private async joinVoiceChannel(member: GuildMember, queue: Queue) {
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
