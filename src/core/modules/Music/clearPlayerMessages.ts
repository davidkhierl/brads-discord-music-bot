import { MusicError } from './Music.js';
import {
	ChatInputCommandInteraction,
	Message,
	TextBasedChannel,
} from 'discord.js';

/**
 * Delete player messages
 * @param channel Channel
 * @param options Interaction or Message
 */
export default async function clearPlayerMessages(
	channel: TextBasedChannel | null | undefined,
	options: {
		message?: Message;
		interaction?: ChatInputCommandInteraction;
		delay?: number;
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
				(message) => message.member?.id === channel.client.user?.id
			)
		);
		if (options.message) options.message.delete();
		if (options.interaction && !options.interaction?.ephemeral)
			options.interaction.deleteReply();
	}, options?.delay ?? 30000);
}
