import { MusicQueue } from './Music.js';

const playerError = (error: string, queue: MusicQueue) => {
	console.log('Player Error: ', error);

	if (queue) queue.stop();
};

export default playerError;
