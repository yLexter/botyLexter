const { MessageEmbed } = require("discord.js");
const Command = require('../../classes/command')

class CommandSkip extends Command {
  constructor() {
    super({
      name: "skip",
      help: "Pula para a proxima música.",
      type: 'music',
      aliase: ["sk"],
    })
  }

  async execute(client, msg, args) {

    const { cor } = client
    const { skip, stop } = client.music

    try {

      const queue = client.queues.get(msg.guild.id);

      if (!queue) {
        const helpMsg = new MessageEmbed()
          .setColor(cor)
          .setAuthor({ name: `| Não existe Músicas sendo Tocada.`, iconURL: msg.author.displayAvatarURL() })
        return msg.channel.send({ embeds: [helpMsg] })
      }

      skip(client, msg)

    } catch (e) { stop(client, msg), msg.channel.send(`\`${e}\``) }
  }
}

module.exports = CommandSkip







