import { Injectable } from '@nestjs/common';

import { BotService } from '@/core/bot/bot.service';

@Injectable()
export default class FrennyBotService {
  constructor(private readonly botService: BotService) {
    console.log(FrennyBotService.name, botService.getToken());
  }
}
