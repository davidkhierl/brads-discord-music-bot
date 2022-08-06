import { PrismaClient } from '@prisma/client';

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DEPLOY_COMMANDS?: 'guild' | 'global';
			DISCORD_APP_ID: string;
			DISCORD_PUB_KEY: string;
			DISCORD_BOT_TOKEN: string;
			DISCORD_DEVELOPMENT_GUILD_ID: string;
			SENTRY_DSN: string;
			SERVER_NAME?: string;
		}

		interface Global {
			__rootdir__: string;
		}
	}

	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}
