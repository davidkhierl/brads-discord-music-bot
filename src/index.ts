import FrennyBot, { getFrennyBotInstance } from './bots/FrennyBot/FrennyBot.js';
import BotManager from './core/bot/BotManager.js';
import Music from './core/modules/Music.js';
import prisma from './lib/prisma.js';
import { __rootdir__ } from './root.js';
import getSentryReleaseName from './utils/getSentryReleaseName.js';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

/**
 * Initialize Sentry
 */
if (process.env.NODE_ENV === 'production') {
	const releaseName = await getSentryReleaseName();

	console.log('Initializing Sentry');

	console.log('[Sentry Release]:', releaseName);

	Sentry.init({
		environment: process.env.NODE_ENV ?? 'development',
		dsn: process.env.SENTRY_DSN,
		release: releaseName,
		tracesSampleRate: 1.0,
		serverName: process.env.SERVER_NAME,
		integrations: [
			new RewriteFrames({
				root: __rootdir__ ?? process.cwd(),
			}),
			new Tracing.Integrations.Prisma({ client: prisma }),
			new Sentry.Integrations.Modules(),
		],
	});
}

export const botManager = BotManager.create(new FrennyBot());

const frennyBot = getFrennyBotInstance();

frennyBot.registerModules(Music);

botManager.start();
