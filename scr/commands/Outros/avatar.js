const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    help: "Exibe o seu avatar.",
    type: "fun",
    aliase: [],
    execute: async (client, msg, args, cor) => {
        try {
            const mention = msg.mentions.members.first() || msg.member
            const link = mention.displayAvatarURL({ size: 1024, dynamic: true })
            const helpMsg = new MessageEmbed()
                .setColor(cor)
                .setDescription(`[Link do Avatar](${link})`)
                .setTitle(`Avatar de ${mention.user.username}#${mention.user.discriminator}`)
                .setImage(link)
            return msg.channel.send({ embeds: [helpMsg] })
        } catch (e) { return msg.channel.send(`\`${e}\``) }

    }
};