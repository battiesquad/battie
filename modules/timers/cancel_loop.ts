import { Command } from "../../models/Command";
import { BattieTimer, loops } from "./timer-module";

export const cancelLoop: Command = {
    name: "cancel_loop",
    format: "cancel_loop <name>",
    description: "Stopt de looping timer met de gegeven 'name'",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Get timer name
        const loopName = args.shift()?.toString().toLowerCase();
        if (!loopName) {
            channel.send(
                `Loop heeft geen naam. Command format: ${cancelLoop.description}`
            );
            return;
        }

        const loop: BattieTimer | undefined = loops
            .get(user.id)
            ?.find((t) => t.name === loopName);

        if (!loop) {
            channel.send(`Geen loop gevonden met deze naam.`);
            return;
        }

        clearTimeout(loop.timeout);
        const index = loops.get(user.id)?.indexOf(loop)!;
        loops.get(user.id)?.splice(index, 1);

        channel.send(`Loop met naam ${loopName} is uitgeschakeld`);
    },
};
