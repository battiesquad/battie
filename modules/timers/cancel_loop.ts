import { Channel, User, TextChannel } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, loops } from "./timer-module";

export const cancelIndividualLoop = (
    battieLoop: BattieTimer | undefined,
    channel: Channel,
    user: User
) => {
    if (!battieLoop) {
        (channel as TextChannel).send(`Geen loop gevonden met deze naam.`);
        return;
    }

    clearTimeout(battieLoop.timeout);
    const index = loops.get(user.id)?.indexOf(battieLoop)!;
    loops.get(user.id)?.splice(index, 1);
};

export const cancelLoop: Command = {
    name: "cancel_loop",
    format: "cancel_loop [<name>] [-all]",
    description:
        "Stopt de looping timer met de gegeven 'name'. Gebruik de optie '-all' om alle loops die je hebt te cancelen.",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Check for option -all
        if (args.find((str) => str === "-all")) {
            const battieLoops = loops.get(user.id);
            if (!battieLoops) {
                channel.send(`Je hebt nog geen loops geplaatst.`);
                return;
            } else {
                // Cancel all loops
                battieLoops.forEach((t) => {
                    clearTimeout(t.timeout);
                });
                loops.delete(user.id);
                channel.send(`Je hebt al je loops gecancelt.`);
            }
        } else {
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

            cancelIndividualLoop(loop, channel, user);

            channel.send(`Loop met naam ${loopName} is uitgeschakeld`);
        }
    },
};
