import { Command } from "../../models/Command";
import { BattieTimer, loops } from "./timer-module";
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
        finalString += "Je hebt nog geen loops geplaatst";
    } else {
        finalString += "Je hebt de volgende loops geplaatst:\n```";
        battieTimers.forEach((battieTimer) => {
            finalString += `naam: ${
                battieTimer.name
            }\nVolgende melding over: ${buildTimeLeftString(
                battieTimer.timerFinishesOn
            )}\nBericht: ${
                battieTimer.message ? battieTimer.message : ""
            } \`\`\`\n`;
        });
    }

    return finalString;
};

export const getLoops: Command = {
    name: "get_loops",
    format: "get_loops",
    description:
        "Geeft alle looping timers weer die door jou aangemaakt. Geeft momenteel alleen actieve looping timers weer.",
    execute: (message, args) => {
        const channel = message.channel;
        const battieLoops = loops.get(message.author.id);

        if (!battieLoops) {
            channel.send("Je hebt nog geen loops geplaatst.");
            return;
        }

        channel.send(buildTimerString(battieLoops));
    },
};
