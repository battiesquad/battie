import { TextChannel, User } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, timers } from "./timer-module";
import moment from "moment";
import { setNewTimer } from "./set_timer";

const resetIndividualTimer = (battieTimer: BattieTimer, user: User) => {
    // Cancel current timeouts
    clearTimeout(battieTimer.timeout);

    // Create new timeout
    const newTimer = setNewTimer(
        user,
        battieTimer.name,
        battieTimer.message,
        battieTimer.totalSeconds
    );
    battieTimer.timeout = newTimer;

    // Set new finishes-on moment
    battieTimer.timerFinishesOn = moment().add(
        battieTimer.totalSeconds,
        "seconds"
    );
};

export const resetAllTimers = (user: User, channel: TextChannel) => {
    const userTimers = timers.get(user.id);

    if (!userTimers) {
        channel.send(`Je hebt nog geen timers.`);
        return;
    } else {
        userTimers.forEach((battieTimer) => {
            resetIndividualTimer(battieTimer, user);
        });
        channel.send(`Al je timers zijn gereset.`);
    }
};

export const resetTimer: Command = {
    name: "reset_timer",
    format: "reset_timer [<name>] [-all]",
    description:
        "Reset de timer met de gegeven 'name'. Gebruikt de oorspronkelijke duratie. Gebruik de optie '-all' om alle timers die je hebt te resetten.",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Check for option -all
        if (args.find((str) => str === "-all")) {
            resetAllTimers(user, channel as TextChannel);
        } else {
            // Get timer name
            const timerName = args.shift()?.toString().toLowerCase();
            if (!timerName) {
                channel.send(
                    `Geef een naam mee. Command format: ${resetTimer.description}`
                );
                return;
            } else {
                const battieTimer = timers
                    .get(user.id)
                    ?.find((t) => t.name === timerName);
                if (!battieTimer) {
                    channel.send(
                        `Geen timer gevonden met deze naam. Command format: ${resetTimer.description}`
                    );
                    return;
                } else {
                    resetIndividualTimer(battieTimer, user);

                    channel.send(
                        `Je timer '${battieTimer.name}' is gereset.`
                    );
                    return;
                }
            }
        }
    },
};
