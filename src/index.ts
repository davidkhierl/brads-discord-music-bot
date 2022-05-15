import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot';
import { __rootdir__ } from './root';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import chalk from 'chalk';
import { log } from 'console';
import dotenv from 'dotenv';

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
	release: process.env.npm_package_version,
	tracesSampleRate: 1.0,
	integrations: [
		new RewriteFrames({
			root: __rootdir__,
		}),
	],
});
