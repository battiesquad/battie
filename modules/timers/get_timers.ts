import { Command } from "../../models/Command";
import { BattieTimer, timers } from "./timer-module";
import moment from "moment";

const buildTimeLeftString: (m: moment.Moment) => string = (m) => {
    const timeLeft = Math.round((-1 * moment().diff(m)) / 1000);
    if (!timeLeft) return "ERROR";

    const seconds = timeLeft;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const finalMinutes = minutes - hours * 60;
    const finalSeconds = seconds - minutes * 60;

    return `${hours}:${finalMinutes}:${finalSeconds}`;
};

const buildTimerString: (battieTimers: BattieTimer[]) => string = (
    battieTimers
) => {
    let finalString = "";

    if (battieTimers?.length === 0) {
        finalString += "Je hebt nog geen timers geplaatst";
    } else {
        finalString += "Je hebt de volgende timers geplaatst:\n";
        battieTimers.forEach((battieTimer) => {
            finalString += `\`\`\`naam: ${
                battieTimer.name
            }\nLoopt af over: ${buildTimeLeftString(
                battieTimer.timerFinishesOn
            )}\nBericht: ${
                battieTimer.message ? battieTimer.message : ""
            } \`\`\``;
        });
    }

    return finalString;
};

export const getTimers: Command = {
    name: "get_timers",
    format: "get_timers",
    description:
        "Geeft alle timers weer die door jou aangemaakt. Geeft momenteel alleen actieve timers weer.",
    execute: (message, args) => {
        const channel = message.channel;
        const battieTimers = timers.get(message.author.id);

        if (!battieTimers) {
            channel.send("Je hebt nog geen timers geplaatst.");
            return;
        }

        channel.send(buildTimerString(battieTimers));
    },
};
