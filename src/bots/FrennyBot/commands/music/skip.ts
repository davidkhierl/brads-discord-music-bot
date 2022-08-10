import Bot, { UserCommandError } from '../../../../core/bot/Bot.js';
import BotCommandBuilder from '../../../../core/bot/BotCommandBuilder.js';
import MessageEmbeds from '../../../../core/components/MessageEmbeds.js';
import { isMusic } from '../../../../core/modules/Music.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default class skip extends BotCommandBuilder {
	constructor() {
		super({ deferReply: true, ephemeral: true });
		this.slash
			.setName('skip')
			.setDescription('Skip the current song being played')
			.addIntegerOption((option) =>
				option
					.setName('index')
					.setDescription(
						'The index of the song from the queue you want to skip to.'
					)
			);
	}

	async execute(
		interaction: ChatInputCommandInteraction,
		bot: Bot
	): Promise<void> {
		const music = bot.modules.get('music');
		if (!isMusic(music) || !interaction.guildId) return;

		const { join, queue, guildQueue } = music.init(interaction);

		const queueCount = guildQueue?.songs.length;

		if (!queue.isPlaying || !queueCount)
			throw new UserCommandError('🙄   Yow! there are no songs playing');
		queue.setData({ interaction });

		const currentTrack = guildQueue?.songs[0];
		const optionIndex = interaction.options.getInteger('index');

		if (queueCount === 1)
			throw new UserCommandError('😐   No more songs to skip to');
		if (optionIndex && optionIndex > queueCount - 1)
			throw new UserCommandError(
				`😐   There's only ${queueCount - 1} songs left`
			);

		if (optionIndex) {
			queue.skip(optionIndex - 1);
		} else {
			queue.skip();
		}

		await queue.data?.interaction.editReply({
			embeds: [
				MessageEmbeds.Info({
					title: `${currentTrack.name}`,
					thumbnail: { url: currentTrack.thumbnail },
					author: { name: 'Skipping song' },
				}),
			],
		});

		await queue.data?.interaction.channel?.send({
			embeds: [
				MessageEmbeds.Warning({
					title: '',
					description: `> ${currentTrack.name}`,
					author: {
						name: 'Song skipped',
					},
					footer: {
						text: `Skipped by:   ${queue.data.interaction.user.username}\nPlaying in:   ${queue.connection?.channel.name}`,
						iconURL: queue.data.interaction.user?.displayAvatarURL({
							size: 16,
						}),
					},
				}),
			],
		});
	}
}
