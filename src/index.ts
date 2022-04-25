import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

import '@sentry/tracing';

import dotenv from 'dotenv';
import { __rootdir__ } from './root';
import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot';
import chalk from 'chalk';
import { log } from 'console';

dotenv.config();

log(chalk.bgBlue.bold.white(' Starting Frenny Bots '));

/**
 * Bots
 */
const frennyDjBotClient = FrennyDJBot.getClient();

frennyDjBotClient.once('ready', () => {
	log(`${FrennyDJBot.name} ${chalk.bgGreen.black(' Ready ')}`);
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
