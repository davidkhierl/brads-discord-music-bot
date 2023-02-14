import { Client, ClientOptions } from 'discord.js';

export interface BotClient {
  client: Client;
  login: () => Promise<string>;
}

export interface BotClientOptions {
  clientOptions: ClientOptions;
  token: string;
}

export class Bot implements BotClient {
  readonly client: Client<boolean>;

  readonly token: string;

  constructor(options: BotClientOptions) {
    this.client = new Client(options.clientOptions);
    this.token = options.token;
  }

  async login() {
    return await this.client.login(this.token);
  }
}

export interface BotCreate {
  createBot: (options: BotClientOptions) => Bot;
}

export class BotFactory implements BotCreate {
  createBot(options: BotClientOptions): Bot {
    return new Bot(options);
  }
}
