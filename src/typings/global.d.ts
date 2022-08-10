import { PrismaClient } from '@prisma/client';

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DEPLOY_COMMANDS?: 'guild' | 'global';
			DATABASE_URL: string;
			DISCORD_APP_ID: string;
			DISCORD_PUB_KEY: string;
			DISCORD_BOT_TOKEN: string;
			DISCORD_DEVELOPMENT_GUILD_ID: string;
			SENTRY_AUTH_TOKEN: string;
			SENTRY_DSN: string;
			SENTRY_ORG: string;
			SENTRY_PROJECT: string;
			SERVER_NAME?: string;
		}

		interface Global {
			__rootdir__: string;
		}
	}

	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}
