import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';

export const channelEmpty = async (queue: MusicQueue) => {
	const endReply = await queue.data?.interaction.channel?.send({
		embeds: [
			MessageEmbeds.Warning({
				title: '🥺   Everyone left the channel',
			}),
		],
	});

	setTimeout(() => {
		endReply?.delete();
	}, 30000);
};
