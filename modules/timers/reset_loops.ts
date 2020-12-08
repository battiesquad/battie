import { TextChannel, User } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, loops } from "./timer-module";
import moment from "moment";
import { setNewTimer } from "./set_timer";

const resetIndividualLoop = (battieLoop: BattieTimer, user: User) => {
    // Cancel current timeouts
    clearTimeout(battieLoop.timeout);

    // Create new timeout
    const newLoop = setNewTimer(
        user,
        battieLoop.name,
        battieLoop.message,
        battieLoop.totalSeconds
    );
    battieLoop.timeout = newLoop;

    // Set new finishes-on moment
    battieLoop.timerFinishesOn = moment().add(
        battieLoop.totalSeconds,
        "seconds"
    );
};

export const resetAllLoops = (user: User, channel: TextChannel) => {
    const userLoops = loops.get(user.id);

    if (!userLoops) {
        channel.send(`Je hebt nog geen loops.`);
        return;
    } else {
        userLoops.forEach(battieLoop => {
            resetIndividualLoop(battieLoop, user);
        });
        channel.send(`Al je loops zijn gereset.`);
    }
};

export const resetLoop: Command = {
    name: "reset_loop",
    format: "reset_loop [<name>] [-all]",
    description:
        "Reset de loop met de gegeven 'name'. Gebruikt de oorspronkelijke duratie. Gebruik de optie '-all' om alle loops die je hebt te resetten.",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Check for option -all
        if (args.find((str) => str === "-all")) {
            resetAllLoops(user, channel as TextChannel);
        } else {
            // Get loop name
            const loopName = args.shift()?.toString().toLowerCase();
            if (!loopName) {
                channel.send(
                    `Geef een naam mee. Command format: ${resetLoop.description}`
                );
                return;
            } else {
                const battieLoop = loops
                    .get(user.id)
                    ?.find((t) => t.name === loopName);
                if (!battieLoop) {
                    channel.send(
                        `Geen loop gevonden met deze naam. Command format: ${resetLoop.description}`
                    );
                    return;
                } else {
                    resetIndividualLoop(battieLoop, user);

                    channel.send(
                        `Je loop '${battieLoop.name}' is gereset.`
                    );
                    return;
                }
            }
        }
    },
};
