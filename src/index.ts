import FrennyAutomateBot from './bots/FrennyAutomateBot/FrennyAutomateBot.js';
import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot.js';
import Frenny from './core/Frenny.js';
import { __rootdir__ } from './root.js';
import getSentryReleaseName from './utils/getSentryReleaseName.js';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';

/**
 * Initialize Sentry
 */
const releaseName = await getSentryReleaseName();

console.log('Initializing Sentry');

console.log('[Sentry Release]:', releaseName);

Sentry.init({
	environment: process.env.NODE_ENV ?? 'development',
	dsn: process.env.SENTRY_DSN,
	release: releaseName,
	tracesSampleRate: 1.0,
	integrations: [
		new RewriteFrames({
			root: __rootdir__ ?? process.cwd(),
		}),
	],
});

export const frenny = Frenny.create(new FrennyAutomateBot(), new FrennyDJBot());

frenny.start();
