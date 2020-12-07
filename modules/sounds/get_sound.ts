import { Command } from "../../models/Command";
import * as path from "path";
import * as fs from "fs";
import { SOUND_FILES_DIR_REL_PATH } from "./sounds-module";

export const getSound: Command = {
    name: "get_sound",
    description: "geeft alle beschikbare sounds weer",
    execute(message, args) {
        const files = fs.readdirSync(path.join(__dirname, SOUND_FILES_DIR_REL_PATH));
        message.channel.send(
            `hier een lijst met beschikbare sounds. Typ -play_sound {filenaam} om er een af te spelen`
        );
        message.channel.send(files);
    },
};
