import { UserCommandError } from '../bot/Bot.js';
import { Player, Queue } from 'discord-music-player';
import {
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Guild,
	GuildMember,
} from 'discord.js';

/**
 * Music
 */
export default class Music {
	/**
	 * Bot client instance
	 */
	private readonly client: Client<boolean>;

	/**
	 * Interaction command
	 */
	readonly interaction: ChatInputCommandInteraction<CacheType>;

	/**
	 * DMPlayer instance
	 */
	readonly player: Player;

	/**
	 * Player queue
	 */
	readonly queue: Queue;

	/**
	 * Guild queue
	 */
	readonly guildQueue?: Queue;

	/**
	 * Guild Id
	 */
	private readonly guildId: string;

	/**
	 * Current guild of the interaction
	 */
	private readonly guild: Guild;

	/**
	 * Current member initiated the interaction
	 */
	private readonly member: GuildMember;

	/**
	 * Class for playing and controlling songs queue.
	 * @param interaction Command interaction
	 */
	constructor(
		interaction: ChatInputCommandInteraction<CacheType>,
		player: Player
	) {
		this.client = interaction.client;

		this.interaction = interaction;

		this.player = player;

		if (!this.interaction.guildId)
			throw new Error('❌ | Error: guild id missing.');

		this.guildId = this.interaction.guildId;

		const guild = this.client.guilds.cache.get(this.guildId);

		if (!guild) throw new Error('❌ | Error: cannot retrieve guild.');

		this.guild = guild;

		this.guildQueue = this.player.getQueue(this.guildId);

		this.queue = this.player.createQueue(this.guildId, {
			data: this.interaction.channel,
		});

		this.member = this.getGuildMember();
	}

	/**
	 * Join the voice channel of member
	 * initiated the interaction
	 */
	async joinVoiceChannel() {
		if (!this.member.voice.channel)
			throw new UserCommandError(
				`🥱 ${this.client.user?.username} failed to join the voice channel. Please make sure that you're already in a voice channel and try the command again.`
			);
		await this.queue.join(this.member.voice.channel);
	}

	/**
	 * Get the member initiated the interaction
	 * @returns The member initiated the interaction
	 */
	private getGuildMember(): GuildMember {
		const guildMember = this.guild.members.cache.get(
			this.interaction.user.id
		);

		if (!guildMember) throw new Error('❌ | cannot retrieve guild member.');

		return guildMember;
	}
}
