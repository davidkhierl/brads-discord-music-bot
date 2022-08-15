import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';
import { clearPlayerMessages } from './clearPlayerMessages.js';

export const queueEnd = async (queue: MusicQueue) => {
	const endReply = await queue.data?.interaction.channel?.send({
		embeds: [
			MessageEmbeds.Success({
				title: '🥳   Finished playing music, hope you enjoyed your music!',
				description: '🧹   clearing player messages after 30 seconds',
			}),
		],
	});

	await clearPlayerMessages(queue.data?.interaction.channel, {
		message: endReply,
	});
};
