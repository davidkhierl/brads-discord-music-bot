import MessageEmbeds from '../../components/MessageEmbeds.js';
import { MusicQueue } from './Music.js';
import { Playlist } from 'discord-music-player';

const playlistAdd = (_queue: MusicQueue, playlist: Playlist) => {
	playlist.songs[0].data?.interaction.editReply({
		embeds: [
			MessageEmbeds.Info({
				title: `${playlist}`,
				thumbnail: { url: playlist.songs[0].thumbnail },
				url: playlist.songs[0].data.playlistUrl,
				fields: [
					{
						name: 'Number of songs',
						value: `**${playlist.songs.length}**`,
						inline: true,
					},
				],
				author: {
					name: '🎧   Playing Music, Enjoy!',
				},
			}),
		],
	});
};

export default playlistAdd;
