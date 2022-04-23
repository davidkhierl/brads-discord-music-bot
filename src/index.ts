import dotenv from 'dotenv';
import Brads from './brads/Brads';
import MusicModule from './modules/Music/MusicModule';

dotenv.config();

const brads = new Brads();

Brads.registerModule(new MusicModule());

brads.client.on('ready', (client) => {
	client.user.setActivity({ name: 'with Frennies', type: 'PLAYING' });
	console.log(`Logged in as ${client.user.tag}!`);
});
