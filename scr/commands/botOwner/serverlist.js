const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const moment = require('moment')
const Command = require('../../classes/command')

class CommandServerList extends Command {

    constructor() {
        super({
            name: "serverlist",
            help: "Mostra a lista de servers do bot.",
            type: 'ownerBot',
            botOwner: true,
            aliase: ["slist"],
        })
    }

    async execute(client, msg, args) {

        try {
            const { cor } = client
            let contador = 0
            const finishCommand = 200
            let servidores = client.guilds.cache.map(x => {
                const { name, id, ownerId, memberCount, joinedAt, createdAt } = x
                return {
                    name,
                    id,
                    createdAt,
                    ownerId,
                    joinedAt,
                    memberCount,
                    icon: x.iconURL()
                }
            })

            const serverAmount = servidores.length - 1
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('forward')
                        .setEmoji('◀️')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('rewind')
                        .setEmoji('▶️')
                        .setStyle('PRIMARY'),
                );

            const msgPrincipal = await msg.channel.send({ embeds: [embedServer(getServerByContador())], components: [row] })

            function embedServer(data) {
                const { name, id, ownerId, memberCount, joinedAt, icon, createdAt } = data
                const iconGuild = icon || 'https://spng.pngfind.com/pngs/s/154-1548198_discord-gg-cute-discord-hd-png-download.png'
                const helpMsg = new MessageEmbed()
                    .setColor(cor)
                    .setTitle(name)
                    .setURL(iconGuild)
                    .setThumbnail(iconGuild)
                    .setFields(
                        { name: '🆔 ID do Servidor', value: String(id) },
                        { name: '🔰 Dono do Servidor', value: `<@${ownerId}>` },
                        { name: '📅 Entrei em', value: String(moment(joinedAt).format('LLLL')), inline: true },
                        { name: '📅 Servidor criado em', value: String(moment(createdAt).format('LLLL')), inline: true },
                        { name: '🔱 Total de Membros', value: `${memberCount}` },
                    ).setAuthor({ name: `| Lista de Servidores. `, iconURL: iconGuild })
                    .setFooter({ text: ` | Pag: ${contador + 1}/${serverAmount + 1}`, iconURL: iconGuild })
                return helpMsg
            }

            function getServerByContador() {
                return servidores[contador]
            }

            function editEmbed() {
                let servidor = getServerByContador()
                return msgPrincipal.edit({ embeds: [embedServer(servidor)], components: [row] }).catch(() => { })
            }

            const collector = msgPrincipal.createMessageComponentCollector({
                filter: i => { return msg.author.id == i.user.id },
                componentType: 'BUTTON',
                time: finishCommand * 1000
            });

            collector.on('collect', i => {

                const buttons = {
                    'forward': () => {
                        if (contador == 0) return;
                        contador--
                        editEmbed()
                    },
                    'rewind': () => {
                        if (contador == serverAmount) return;
                        contador++
                        editEmbed()
                    }
                }

                try {
                    i.deferUpdate()
                    buttons[i.customId]()
                } catch (e) {
                    console.log(e)
                }

            });

            collector.on('end', collected => {
                msgPrincipal.edit({ components: [] }).catch(() => { })
            });

        } catch (e) { msg.channel.send(`\`${e}\``) }
    }


}

module.exports = CommandServerList






