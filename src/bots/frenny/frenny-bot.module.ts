import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntentsBitField } from 'discord.js';

import FrennyBotService from '@/bots/frenny/frenny-bot.service';
import { FrennyBotENVConfig } from '@/bots/frenny/frenny-bot.type';
import { BotModule } from '@/core/bot/bot.module';

@Module({
  imports: [
    BotModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<FrennyBotENVConfig, true>) => ({
        token: configService.get('FRENNY_DEV_BOT_TOKEN'),
        appId: configService.get('FRENNY_DEV_APPLICATION_ID'),
        clientOptions: {
          intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildVoiceStates,
          ],
        },
        autoLogin: true,
      }),
    }),
  ],
  providers: [FrennyBotService],
  exports: [FrennyBotService],
})
export class FrennyBotModule {}
