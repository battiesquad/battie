import { Command } from "../../models/Command";
import * as path from "path";
import * as fs from "fs";
import { SOUND_FILES_DIR_REL_PATH } from "./sounds-module";

export const playSound: Command = {
    name: "play_sound",
    description: "speelt geluid (als het goed is)",
    execute(message, args) {
        if (!message.member?.voice.channel)
            return message.reply("Je moet in een spraak-kanaal zitten");

        // Checking if the bot is in a voice channel.
        if (message.guild?.me?.voice.channel)
            return message.reply("Ik ben al aan het afspelen");

        try {
            const filePath = path.join(
                __dirname,
                SOUND_FILES_DIR_REL_PATH,
                args.shift()!
            );

            if (fs.existsSync(filePath)) {
                // Joining the channel and creating a VoiceConnection.
                message.member.voice.channel
                    .join()
                    .then((voiceConnection) => {
                        // Playing the music, and, on finish, disconnecting the bot.
                        voiceConnection
                            .play(filePath)
                            .on("finish", () => voiceConnection.disconnect());
                        message.reply(`${args} aan het afspelen.`);
                    })
                    .catch((e) => console.log(e));
            } else {
                message.reply(`je opgegeven bestand ${args} bestaat niet`);
            }
        } catch (err) {
            console.error(err);
        }
    },
};
