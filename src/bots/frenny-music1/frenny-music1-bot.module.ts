import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntentsBitField } from 'discord.js';

import { FrennyMusic1BotService } from '@/bots/frenny-music1/frenny-music1-bot.service';
import { FrennyMusic1BotENVConfig } from '@/bots/frenny-music1/frenny-music1-bot.type';
import { BotModule } from '@/core/bot/bot.module';

@Module({
  imports: [
    BotModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<FrennyMusic1BotENVConfig, true>,
      ) => ({
        token: configService.get('FRENNY_MUSIC1_DEV_BOT_TOKEN'),
        appId: configService.get('FRENNY_MUSIC1_DEV_APPLICATION_ID'),
        clientOptions: {
          intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildVoiceStates,
          ],
        },
      }),
    }),
  ],
  providers: [FrennyMusic1BotService],
  exports: [FrennyMusic1BotService],
})
export class FrennyMusic1BotModule {}
