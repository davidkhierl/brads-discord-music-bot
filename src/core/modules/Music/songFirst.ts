import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';
import { Song } from 'discord-music-player';

export const songFirst = (queue: MusicQueue, song: Song) => {
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
};
