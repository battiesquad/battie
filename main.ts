import Discord from "discord.js";
import { Command } from "./models/Command";
import { helpCommand } from "./modules/help";
import { rolesCommands } from "./modules/roles/roles-module";
import { soundsCommands } from "./modules/sounds/sounds-module";
import { timerCommands } from "./modules/timers/timer-module";

const isProductionEnv = process.env.NODE_ENV === "production";

// Setup discord client
const client = new Discord.Client();

// Set command prefix based on environment
export const COMMAND_PREFIX = isProductionEnv ? "-" : "b-";

// Get all desired commands that the server should handle
export const commandList: Command[] = [
    helpCommand,
    ...rolesCommands,
    ...timerCommands,
    ...soundsCommands,
];

// Make a collection of all the commands the server should handle
const commands = new Discord.Collection<string, Command>();

// Fill the commands collection
commandList.forEach((command) => commands.set(command.name, command));

client.once("ready", () => {
    client.user?.setUsername(`Battiebot${isProductionEnv ? "" : " (beta)"}`);
    console.log("Battiebot is aanwezig");
});

client.on("message", (message) => {
    // Check whether bot should ignore incoming message
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot)
        return;

    // Get the command and arguments
    const args = message.content.slice(COMMAND_PREFIX.length).split(/ +/);

    // Get the command and remove it from args array
    const command = args.shift()?.toLowerCase();
    if (!command) return;

    // Get the desired client command
    const clientCommand = commands.get(command);

    // If command exists, execute it
    if (clientCommand) clientCommand.execute(message, args);
    // Otherwise return
    else return;
});

if (isProductionEnv && process.env.ACCESS_TOKEN) {
    client.login(process.env.ACCESS_TOKEN);
} else {
    try {
        const { ACCESS_TOKEN } = require("./djs-key");
        client.login(ACCESS_TOKEN);
    } catch (error) {
        console.error("No access token found");
    }
}