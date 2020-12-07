import { commandList } from "../main";
import { Command } from "../models/Command";

export const helpCommand: Command = {
    name: "help",
    description: "help",
    execute(message, _) {
        const channel = message.channel;

        let printString = "```";

        commandList.forEach((c) => {
            printString += `${c.name}; beschrijving: ${c.description}\n`;
        });

        printString += "```";

        channel.send(printString);
    },
};
