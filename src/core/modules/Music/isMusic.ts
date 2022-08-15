import BotModule from '../../bot/BotModule.js';
import { Music } from './Music.js';

/**
 * Music type guard
 * @param module BotModule
 * @returns boolean
 */
export function isMusic(module?: BotModule): module is Music {
	return module instanceof Music;
}
