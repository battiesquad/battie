import { User } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, timers } from "./timer-module";
import moment from "moment"

const setNewTimer = (
    timerName: string,
    timeout: NodeJS.Timeout,
    message: string | null,
    user: User,
    seconds: number,
) => {
    if (!timers.has(user.id)) {
        timers.set(user.id, []);
    }

    const battieTimer: BattieTimer = {
        isLoop: false,
        name: timerName,
        timeout,
        message,
        timerFinishesOn: moment().add(seconds, 'seconds'),
    };

    timers.get(user.id)!!.push(battieTimer);
};

export const setTimer: Command = {
    name: "set_timer",
    description: "set_timer <name> <h:m:s> [message]",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        // Get timer name
        const timerName = args.shift()?.toString().toLowerCase();
        if (!timerName) {
            channel.send(
                `Timer heeft geen naam. Command format: ${setTimer.description}`
            );
            return
        }

        // Get timer times
        const timeArray = args.shift()?.split(":");
        if (timeArray?.length != 3) {
            channel.send(
                `Tijdsformaat klopt niet. Command format: ${setTimer.description}`
            );
            return;
        }

        // Attempt setting the timer
        try {
            const hours = +timeArray[0];
            const minutes = +timeArray[1];
            const seconds = +timeArray[2];
            const totalSeconds = seconds + minutes * 60 + hours * 3600;

            const message = args.join(" ") || null;

            const newTimer = setTimeout(() => {
                channel.send(
                    `<@${
                        user.id
                    }>, je timer '${timerName}' is afgelopen! Bericht: ${
                        message ? message : ""
                    }`
                );
            }, totalSeconds * 1000);

            setNewTimer(timerName!, newTimer, message, user, totalSeconds);

            channel.send(
                `Timer geplaatst voor <@${user}>. Timer loopt af over ${hours}:${minutes}:${seconds} (${totalSeconds} seconden)`
            );
        } catch (error) {
            channel.send(
                `Geen valid input. Iets klopt er niet. Command format: ${setTimer.description}`
            );
        }
    },
};
