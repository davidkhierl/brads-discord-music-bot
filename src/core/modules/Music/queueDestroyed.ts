import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';
import { clearPlayerMessages } from './index.js';

export const queueDestroyed = async (queue: MusicQueue) => {
	const endReply = await queue.data?.interaction.channel?.send({
		embeds: [
			MessageEmbeds.Warning({
				title: '🙌   Music stopped',
				description: '🧹   clearing player messages after 30 seconds',
				footer: {
					text: `${queue.data?.interaction.user.username}`,
					iconURL: queue.data?.interaction.user.displayAvatarURL({
						size: 16,
					}),
				},
			}),
		],
	});

	await clearPlayerMessages(queue.data?.interaction.channel, {
		message: endReply,
	});
};
