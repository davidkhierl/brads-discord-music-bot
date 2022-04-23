import { Player, Queue } from 'discord-music-player';
import { Guild, GuildMember } from 'discord.js';
import { CommandContext } from 'slash-create';
import Bot from '../../bot/Bot';
import MusicPlayer from './MusicPlayer';

export default class Music {
	private readonly bot: Bot;

	readonly ctx: CommandContext;

	readonly player: Player;

	readonly queue: Queue;

	readonly guildQueue?: Queue;

	private readonly guildId: string;

	private readonly guild: Guild;

	private readonly member: GuildMember;

	constructor(ctx: CommandContext) {
		this.bot = Bot.getInstance();
		this.ctx = ctx;
		this.player = MusicPlayer.getPlayer();

		if (!this.ctx.guildID) throw new Error('❌ | Error: guild id missing.');

		this.guildId = this.ctx.guildID;

		const guild = this.bot.client.guilds.cache.get(this.guildId);

		if (!guild) throw new Error('❌ | Error: cannot retrieve guild.');

		this.guild = guild;

		this.guildQueue = this.player.getQueue(this.guildId);

		this.queue = this.player.createQueue(this.guildId, {
			data: this.guild.channels.cache.get(this.ctx.channelID),
		});

		this.member = this.getGuildMember();
	}

	async joinVoiceChannel() {
		if (!this.member.voice.channel)
			throw new Error(
				`🥱 ${this.bot.client.user?.username} failed to join. Please make sure that you're already in a voice channel and try the command again.`
			);
		await this.queue.join(this.member.voice.channel);
	}

	private getGuildMember(): GuildMember {
		const guildMember = this.guild.members.cache.get(this.ctx.user.id);

		if (!guildMember)
			throw new Error('❌ | Error: cannot retrieve guild member.');

		return guildMember;
	}
}
