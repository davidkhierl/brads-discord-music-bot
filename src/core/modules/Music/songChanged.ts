import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';
import { Song } from 'discord-music-player';

export const songChanged = (queue: MusicQueue, newSong: Song) => {
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
};
