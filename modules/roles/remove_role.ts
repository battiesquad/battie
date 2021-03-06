import { Command } from "../../models/Command";

export const removeRole: Command = {
    name: "remove_role",
    format: "remove_role <@user> <role-name>",
    description: "Verwijderd de betreffende rol van de aangegeven gebruiker.",
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
                `de rol ${rol_str} die je wilt verwijderen bestaat niet`
            );
            return;
        } else {
            if (
                rol_str === "Admin" ||
                rol_str === "Mod" ||
                rol_str === "Battie"
            ) {
                message.channel.send(`dat gaan we dus niet doen...`);
            } else {
                if (member.roles.cache.get(role.id)) {
                    message.channel.send(
                        `als het goed is heb je de role ${rol_str} niet meer`
                    );
                    member.roles.remove(role);
                } else {
                    message.channel.send(
                        `als het goed is heb je de role ${rol} niet`
                    );
                }
            }
        }
    },
};
