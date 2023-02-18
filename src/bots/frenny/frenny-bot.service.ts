import { Injectable } from '@nestjs/common';

import { FrennyBotPingCommand } from '@/bots/frenny/frenny-bot-ping.command';
import { BotService } from '@/core/bot/bot.service';

@Injectable()
export default class FrennyBotService {
  constructor(
    private readonly botService: BotService,
    private readonly pingCommand: FrennyBotPingCommand,
  ) {
    console.log(pingCommand.ping());
  }
}
