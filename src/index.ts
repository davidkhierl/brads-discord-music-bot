import FrennyAutomateBot from './bots/FrennyAutomateBot/FrennyAutomateBot.js';
import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot.js';
import Frenny from './core/Frenny.js';
import prisma from './lib/prisma.js';
import { __rootdir__ } from './root.js';
import getSentryReleaseName from './utils/getSentryReleaseName.js';
import { RewriteFrames, Transaction } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

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
			root: process.cwd(),
			prefix: 'src/',
		}),
		new Tracing.Integrations.Prisma({ client: prisma }),
		new Transaction(),
		new Sentry.Integrations.Modules(),
	],
});

export const frenny = Frenny.create(new FrennyAutomateBot(), new FrennyDJBot());

frenny.start();
