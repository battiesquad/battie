import { Command } from "../../models/Command";

export const addRole: Command = {
    name: "add_role",
    description: "Voegt een role toe",
    execute(message, args) {
        const member = message.mentions.members?.first();
        const rol = args.slice(1);
        const rol_str = rol.join(" ");
        const role = message.guild?.roles.cache.find((r) => r.name === rol_str);

        if (!member) {
            message.channel.send("Er zijn geen members getagged.");
            return;
        }

        if (!role) {
            message.channel.send(
                `de role ${rol_str} die je wilt toewijzen bestaat niet`
            );
            return;
        } else {
            if (
                rol_str === "Admin" ||
                rol_str === "Mod" ||
                rol_str == "Battie"
            ) {
                message.channel.send(`dat gaan we dus niet doen....`);
            } else {
                if (member.roles.cache.some((r) => r.name === role.name)) {
                    message.channel.send(`je hebt de role ${rol_str} al`);
                } else {
                    message.channel.send(
                        `als het goed is heb je de role ${rol_str} nu`
                    );
                    member.roles.add(role);
                }
            }
        }
    },
};
