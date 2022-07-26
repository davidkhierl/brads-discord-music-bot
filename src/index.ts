import FrennyAutomateBot from './bots/FrennyAutomateBot/FrennyAutomateBot.js';
import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot.js';
import Frenny from './core/Frenny.js';
import { __rootdir__ } from './root.js';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import '@sentry/tracing';

/**
 * Initialize Sentry
 */
Sentry.init({
	environment: process.env.NODE_ENV,
	dsn: process.env.SENTRY_DSN,
	release: process.env.npm_package_version,
	tracesSampleRate: 1.0,
	integrations: [
		new RewriteFrames({
			root: __rootdir__,
		}),
	],
});

export const frenny = Frenny.create(new FrennyAutomateBot());

frenny.start();
