import { commandList, COMMAND_PREFIX } from "../main";
import { Command } from "../models/Command";

export const helpCommand: Command = {
    name: "help",
    format: "help [command_name]",
    description: "Geeft een overzicht van alle beschikbare commands.",
    execute(message, args) {
        const channel = message.channel;

        const commandName = args.shift();

        // Als een command name is meegegeven, geef een overzicht van dat command
        if (commandName) {
            const command = commandList.find((c) => c.name === commandName);

            if (!command) {
                channel.send(
                    `Er is helaas geen command met de naam ${commandName}. Probeer een andere command.`
                );
                return;
            } else {
                let printString = "```";
                printString += `Command naam:   \t ${command.name}\n`;
                printString += `Command format: \t ${command.format}\n`;
                printString += `Beschrijving:   \t ${command.description}\n`;
                printString += "```";

                channel.send(printString);
            }
        }

        // Anders geef een overzicht van alle commands
        else {
            let printString = "```";
            printString += `Voor een uitgebruid overzicht van de verschillende commands, gebruik ${COMMAND_PREFIX}help <command_name>\n\n`;

            commandList.forEach((c) => {
                printString += `${c.name}\n`;
            });

            printString += "```";

            channel.send(printString);
        }
    },
};
