const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "helpowner",
    help: "Mostra todos os comandos que só podem ser usado pelo dono do bot.",
    type: 'ownerBot',
    aliase: ["howner" , "ohelp"],
    execute: async (client, msg, args, cor) => {

        try {
            const s = args.join(' ')
            const allCommands = [...client.commands.values()].filter(x => { return x.type == 'ownerBot' })
            const info = allCommands.find(y => y.name == s.toLowerCase()) || allCommands.find(x => x.aliase.find(y => y.toLowerCase() == s.toLowerCase()))
            const string = `**Owner Commands[${allCommands.length}]**\n${allCommands.map(x => {return `\`${x.name}\``}).join(", ")}`

            if (info) {
                const cdCommand = info.cooldown || process.env.cdCmd
                const stringAliase = info.aliase.length > 0 ? info.aliase.join(", ") : 'Não Definido'
                const usage = info.usage || `<Comando>`
                const helpMsg = new MessageEmbed()
                    .setColor(cor)
                    .setAuthor({ name: ' | 🛠️ Informação do Comando', iconURL: msg.author.displayAvatarURL() })
                    .setDescription(`**Comando **\`${info.name}\`\n**Descrição ** \`${info.help}\`\n **Usage ** \`${usage}\`\n  **Aliase's **  \`${stringAliase}\`\n**Cooldown ** \`${cdCommand}\``)
                return msg.channel.send({ embeds: [helpMsg] })
            }

            const helpMsg = new MessageEmbed()
                .setColor(cor)
                .setAuthor({ name: ' | 🛠️ Commands', iconURL: msg.author.displayAvatarURL() })
                .setDescription(string)
                .setFooter({ text: 'Detalhes do comando, use help + <comando>.' })
            return msg.channel.send({ embeds: [helpMsg] })

        } catch (e) { msg.channel.send(`\`${e}\``) }
    }
}; // Execute end

