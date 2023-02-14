import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from '@/app.service';
import { FrennyMusic1BotModule } from '@/bots/frenny-music1/frenny-music1-bot.module';
import { FrennyBotModule } from '@/bots/frenny/frenny-bot.module';

@Module({
  imports: [ConfigModule.forRoot(), FrennyBotModule, FrennyMusic1BotModule],
  providers: [AppService],
})
export class AppModule {}
