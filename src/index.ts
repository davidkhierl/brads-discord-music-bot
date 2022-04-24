import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

import '@sentry/tracing';

import dotenv from 'dotenv';
import Brads from './brads/Brads';
import MusicModule from './modules/Music/MusicModule';
import { __rootdir__ } from './root';

dotenv.config();

/**
 * Brads
 */
const brads = new Brads();

/**
 * Register all modules
 */
Brads.registerModule(new MusicModule());

/**
 * Notify log when bot is ready
 */
brads.client.on('ready', (client) => {
	client.user.setActivity({ name: 'with Frennies', type: 'PLAYING' });
	console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Initialize Sentry
 */
Sentry.init({
	environment: process.env.NODE_ENV,
	dsn: 'https://02f1e7085a76466ca57105b20bf00d69@o307506.ingest.sentry.io/6358901',
	tracesSampleRate: 1.0,
	integrations: [
		new RewriteFrames({
			root: __rootdir__,
		}),
	],
});
