import { User } from "discord.js";
import { Command } from "../../models/Command";
import { BattieTimer, loops } from "./timer-module";
import moment from "moment";

const setNewLoop = (
    timerName: string,
    interval: NodeJS.Timeout,
    message: string | null,
    user: User,
    seconds: number
) => {
    if (!loops.has(user.id)) {
        loops.set(user.id, []);
    }

    const battieTimer: BattieTimer = {
        isLoop: true,
        name: timerName,
        timeout: interval,
        message,
        timerFinishesOn: moment().add(seconds, "seconds"),
        totalSeconds: seconds,
    };

    loops.get(user.id)!!.push(battieTimer);
};

export const setLoop: Command = {
    name: "set_loop",
    format: "set_loop <name> <h:m:s> [message]",
    description:
        "Plaatst een looping timer met de gegeven 'name' en 'tijd'. Je kunt een optioneel bericht toevoegen die bijv. als herinnering dient.",
    execute: (message, args) => {
        const channel = message.channel;
        const user = message.author;

        if (!user) {
            message.channel.send(`De Battiebot kan je geen DMs sturen`);
            return;
        }

        // Get timer name
        const loopName = args.shift()?.toString().toLowerCase();
        if (!loopName) {
            channel.send(
                `Loop heeft geen naam. Command format: ${setLoop.description}`
            );
            return;
        }

        // Get timer times
        const timeArray = args.shift()?.split(":");
        if (timeArray?.length != 3) {
            channel.send(
                `Tijdsformaat klopt niet. Command format: ${setLoop.description}`
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

            const newInterval = setInterval(() => {
                user.send(
                    `Je loop '${loopName}' geeft een melding! Bericht: ${
                        message ? message : ""
                    }`
                );
                const loop = loops
                    .get(user.id)
                    ?.find((l) => l.name === loopName);
                if (loop) {
                    loop.timerFinishesOn = moment().add(
                        totalSeconds,
                        "seconds"
                    );
                }
            }, totalSeconds * 1000);

            setNewLoop(loopName!, newInterval, message, user, totalSeconds);

            channel.send(
                `Loop geplaatst voor <@${user}>. Loop geeft elke ${hours}:${minutes}:${seconds} (${totalSeconds} seconden) een melding`
            );
        } catch (error) {
            channel.send(
                `Geen valid input. Iets klopt er niet. Command format: ${setLoop.description}`
            );
        }
    },
};
