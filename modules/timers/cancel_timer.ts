import { User } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, timers } from "./timer-module";

export const cancelTimer: Command = {
    name: "cancel_timer",
    format: "cancel_timer <name>",
    description: "Stopt de timer met de gegeven 'name'",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Get timer name
        const timerName = args.shift()?.toString().toLowerCase();
        if (!timerName) {
            channel.send(
                `Timer heeft geen naam. Command format: ${cancelTimer.description}`
            );
            return;
        }

        const timer: BattieTimer | undefined = timers
            .get(user.id)
            ?.find((t) => t.name === timerName);

        if (!timer) {
            channel.send(`Geen timer gevonden met deze naam.`);
            return;
        }

        clearTimeout(timer.timeout);
        const index = timers.get(user.id)?.indexOf(timer)!;
        timers.get(user.id)?.splice(index, 1);

        channel.send(`Timer met naam ${timerName} is uitgeschakeld`);
    },
};
