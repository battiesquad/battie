import { Channel, TextChannel, User } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, timers } from "./timer-module";

export const cancelIndividualTimer = (
    battieTimer: BattieTimer | undefined,
    channel: Channel,
    user: User
) => {
    if (!battieTimer) {
        (channel as TextChannel).send(`Geen timer gevonden met deze naam.`);
        return;
    }

    clearTimeout(battieTimer.timeout);
    const index = timers.get(user.id)?.indexOf(battieTimer)!;
    timers.get(user.id)?.splice(index, 1);
};

export const cancelTimer: Command = {
    name: "cancel_timer",
    format: "cancel_timer [<name>] [-all]",
    description:
        "Stopt de timer met de gegeven 'name'. Gebruik de optie '-all' om alle timers die je hebt te cancelen.",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Check for option -all
        if (args.find((str) => str === "-all")) {
            const battieTimers = timers.get(user.id);
            if (!battieTimers) {
                channel.send(`Je hebt nog geen timers geplaatst.`);
                return;
            } else {
                // Cancel all timers
                battieTimers.forEach((t) => {
                    clearTimeout(t.timeout);
                });
                timers.delete(user.id);
                channel.send(`Je hebt al je timers gecancelt.`);
            }
        } else {
            // Get timer name
            const timerName = args.shift()?.toString().toLowerCase();
            if (!timerName) {
                channel.send(
                    `Timer heeft geen naam. Command format: ${cancelTimer.description}`
                );
                return;
            }

            const battieTimer: BattieTimer | undefined = timers
                .get(user.id)
                ?.find((t) => t.name === timerName);

            cancelIndividualTimer(battieTimer, channel, user);

            channel.send(`Timer met naam ${timerName} is uitgeschakeld`);
        }
    },
};
