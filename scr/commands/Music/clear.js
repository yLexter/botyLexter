const { MessageEmbed } = require("discord.js");
const Command = require('../../classes/command')

class CommandClear extends Command {
     constructor() {
          super({
               name: "clear",
               help: "Limpa todas as musicas da queue",
               type: 'music',
               aliase: ["cl"],
          })
     }

     async execute(client, msg, args) {

          const { cor } = client
          try {
               const queue = client.queues.get(msg.guild.id);

               if (!queue) {
                    const helpMsg = new MessageEmbed()
                         .setColor(cor)
                         .setAuthor({ name: `| Não existe Músicas sendo Tocada.`, iconURL: msg.author.displayAvatarURL() })
                    return msg.channel.send({ embeds: [helpMsg] })
               }

               queue.songs = [queue.songs[0]];
               client.queues.set(msg.guild.id, queue);

               const helpMsg = new MessageEmbed()
                    .setColor(cor)
                    .setAuthor({ name: `| ✔️ Queue Limpa.`, iconURL: msg.author.displayAvatarURL() })
               return msg.channel.send({ embeds: [helpMsg] })

          } catch (e) { stop(client, msg), msg.channel.send(`\`${e}\``) }
     }
}

module.exports = CommandClear

