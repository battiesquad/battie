import { Message } from "discord.js";

export interface Command {
    name: string;
    format: string;
    description: string;
    execute: (message: Message, args: string[]) => void;
}
