import { User } from "discord.js";
import { Moment } from "moment";
import { cancelLoop } from "./cancel_loop";
import { cancelTimer } from "./cancel_timer";
import { getLoops } from "./get_loops";
import { getTimers } from "./get_timers";
import { resetLoop } from "./reset_loops";
import { resetTimer } from "./reset_timer";
import { setLoop } from "./set_loop";
import { setTimer } from "./set_timer";

export interface BattieTimer {
    isLoop: boolean;
    timeout: NodeJS.Timeout;
    name: string;
    message: string | null;
    timerFinishesOn: Moment;
    totalSeconds: number;
}

export const timers: Map<string, BattieTimer[]> = new Map();

export const loops: Map<string, BattieTimer[]> = new Map();

export const timerCommands = [
    resetLoop,
    resetTimer,
    setTimer,
    getTimers,
    cancelTimer,
    setLoop,
    getLoops,
    cancelLoop,
];
