import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandService {
  getCommand(instance: InstanceType<any>, methodName: string) {
    return Reflect.getMetadata('COMMAND_DECORATOR', instance, methodName);
  }
}
