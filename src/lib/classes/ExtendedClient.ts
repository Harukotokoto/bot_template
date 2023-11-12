import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  IntentsBitField,
  User,
} from 'discord.js';
import { CommandType } from '../interfaces/Command';
import glob from 'glob';
import { promisify } from 'util';
import { Event } from './Event';
const globPromise = promisify(glob);

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
      ],
    });
  }
  start() {
    this.registerModules().then(() => {
      console.log(`\x1b[36mModules has been loaded.\x1b[0m`);
    });
    this.login(process.env.CLIENT_TOKEN).then(() => {
      console.log(`\x1b[32mLogged in successfully.\x1b[0m`);
    });
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerModules() {
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await globPromise(
      __dirname + `/../../commands/*/*{.ts,.js}`
    );
    for (const filePath of commandFiles) {
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) continue;

      console.log(
        `\x1b[36mSlash command: /${command.name} has been loaded.\x1b[0m`
      );

      this.commands.set(command.name, command);
      slashCommands.push(command);
    }

    this.on('ready', () => {
      this.application?.commands
        .set(slashCommands)
        .then(() => {
          console.log(
            `\x1b[32m${slashCommands.length} slash commands registered on ${this.guilds.cache.size} servers.\x1b[0m`
          );
        })
        .catch(async (e) => {
          console.log(
            `\x1b[31mAn error occurred while registering the slash command.\x1b[0m`
          );
          console.log(`\x1b[31m=> ${e}\x1b[0m`);
        });
    });

    const eventFiles = await globPromise(`${__dirname}/../../events/*{.ts,.js}`);
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    }
  }
}
