import { client } from '@/index';
import { APIEmbedFooter } from 'discord.js';

export const footer = (): APIEmbedFooter => {
  return {
    text: client.user?.tag as string,
    icon_url: client.user?.avatarURL() as string,
  };
};
