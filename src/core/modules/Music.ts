import { UserCommandError } from '../bot/Bot.js';
import BotModule from '../bot/BotModule.js';
import MessageEmbeds from '../components/MessageEmbeds.js';
import { Player, Queue } from 'discord-music-player';
import {
	Channel,
	ChatInputCommandInteraction,
	Client,
	GuildMember,
	Message,
	MessageResolvable,
	TextBasedChannel,
} from 'discord.js';

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
			.on('songFirst', (queue, song) => {
				queue.data?.interaction.channel?.send({
					embeds: [
						MessageEmbeds.Info({
							title: `${song.name}`,
							thumbnail: { url: song.thumbnail },
							author: {
								name: 'Now playing',
							},
							url: song.url,
							footer: {
								text: `Added by:   ${song.requestedBy?.username}\nPlaying in:   ${queue.connection?.channel.name}`,
								iconURL: song.requestedBy?.displayAvatarURL({
									size: 16,
								}),
							},
							color: 0xf700ce,
						}),
					],
					content: '',
				});
			})
			.on('songAdd', async (queue, song) => {
				if (song.isFirst) {
					queue.data?.interaction.editReply({
						embeds: [
							MessageEmbeds.Info({
								title: '🎧   Playing Music, Enjoy!',
							}),
						],
					});
					return;
				}

				queue.data?.interaction.editReply({
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
				queue.data?.interaction.channel?.send({
					embeds: [
						MessageEmbeds.Info({
							title: `${newSong.name}`,
							thumbnail: { url: newSong.thumbnail },
							author: { name: 'Now playing' },
							url: newSong.url,
							footer: {
								text: `Added by:   ${newSong.requestedBy?.username}\nPlaying in:   ${queue.connection?.channel.name}`,
								iconURL: newSong.requestedBy?.displayAvatarURL({
									size: 16,
								}),
							},
							color: 0xf700ce,
						}),
					],
					content: '',
				});
			})
			.on('queueEnd', async (queue) => {
				const endReply = await queue.data?.interaction.channel?.send({
					embeds: [
						MessageEmbeds.Success({
							title: '🥳   Finished playing music, hope you had fun!',
							description:
								'🧹   clearing messages after 10 seconds',
						}),
					],
				});

				await this._deletePlayerMessages(
					queue.data?.interaction.channel,
					{ message: endReply }
				);
			})
			.on('queueDestroyed', async (queue) => {
				queue.data?.interaction.reply({
					embeds: [
						MessageEmbeds.Warning({
							title: '🙌   Music stopped',
							description:
								'🧹   clearing messages after 10 seconds',
							footer: {
								text: `${queue.data?.interaction.user.username}`,
								iconURL:
									queue.data?.interaction.user.displayAvatarURL(
										{
											size: 16,
										}
									),
							},
						}),
					],
					ephemeral: false,
				});

				await this._deletePlayerMessages(
					queue.data?.interaction.channel,
					{ interaction: queue.data?.interaction }
				);
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

	/**
	 * Delete player messages
	 * @param channel Channel
	 * @param options Interaction or Message
	 * @returns Promise<void>
	 */
	private async _deletePlayerMessages(
		channel: TextBasedChannel | null | undefined,
		options: {
			message?: Message;
			interaction?: ChatInputCommandInteraction;
		}
	) {
		if (options.interaction && options.message)
			throw new MusicError('Supply only one option');

		if (!channel?.isTextBased() || channel.isDMBased()) return;

		const messages = await channel.messages.fetch({
			before: options.message?.id ?? options.interaction?.id,
		});

		setTimeout(() => {
			channel.bulkDelete(
				messages.filter(
					(message) => message.member?.id === this.client.user.id
				)
			);
			if (options.message) options.message.delete();
			if (options.interaction) options.interaction.deleteReply();
		}, 10000);
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
