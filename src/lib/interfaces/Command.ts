import {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from 'discord.js';
import { ExtendedClient } from '../classes/ExtendedClient';

interface RunOptions {
  client: ExtendedClient;
  interaction: ChatInputCommandInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  ephemeral?: boolean;
  run: RunFunction;
} & ChatInputApplicationCommandData;
