import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';
import { Song } from 'discord-music-player';

const songAdd = (_queue: MusicQueue, song: Song) => {
	if (song.isFirst) {
		song.data?.interaction.editReply({
			embeds: [
				MessageEmbeds.Info({
					title: '🎧   Playing Music, Enjoy!',
				}),
			],
		});
		return;
	}

	song.data?.interaction.editReply({
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
};

export default songAdd;
