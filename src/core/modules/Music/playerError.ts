import { MusicQueue } from './Music.js';

export const playerError = (error: string, queue: MusicQueue) => {
	console.log('Player Error: ', error);

	if (queue) queue.stop();
};
