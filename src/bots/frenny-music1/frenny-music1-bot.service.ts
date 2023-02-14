import { Injectable } from '@nestjs/common';

import { BotService } from '@/core/bot/bot.service';

@Injectable()
export class FrennyMusic1BotService {
  constructor(private readonly botService: BotService) {
    console.log(FrennyMusic1BotService.name, botService.getToken());
  }
}
