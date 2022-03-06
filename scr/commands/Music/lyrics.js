const { MessageEmbed } = require("discord.js");
const Youtube = require("youtube-sr").default;
const lyricsFinder = require('lyrics-finder');
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: "lyrics",
    help: "Busca a lyrics de uma música desejada , Usando lyrics + Posição da música em uma queue procura a mesma | Música tocando agora = 0",
    type: 'music',
    aliase: [],
    execute: async (client, msg, args, cor) => {

        const { titulo_formatado } = client.music
        const queue = client.queues.get(msg.guild.id);

        try {
            const numero = Number(args[0])
            const pesquisa = args.join(' ')

            const msgLyrics = new MessageEmbed()
                .setColor(cor)
                .setAuthor({ name: `| 🔎 Procurando Lyrics...`, iconURL: msg.author.displayAvatarURL() })
            var msg_embed = await msg.channel.send({ embeds: [msgLyrics] })

            isNaN(numero) ? await searchLyrics(pesquisa) : await searchLyricsQueue(numero)

            function lyricsFormated(letra) {
                let max = 4000
                return letra.length > 4000 ? `${letra.substring(0, max)}...` : letra
            }

            async function tituloOfMusic(music) {
                let busca = await Youtube.searchOne(music)
                return !busca || busca.length == 0 ? `Lyrics` : titulo_formatado(busca.title)
            }

            async function searchLyrics(musica) {

                let buscarLyrics = await lyricsFinder(musica)

                if (!buscarLyrics || buscarLyrics == "") {
                    const helpMsg = new MessageEmbed()
                        .setColor(cor)
                        .setAuthor({ name: `Lyrics não encontradas`, iconURL: msg.author.displayAvatarURL() })
                    return msg_embed.edit({ embeds: [helpMsg] }).catch(e => { })
                }

                const lyricsWithLimit = lyricsFormated(buscarLyrics)
                const lyrics = (await translate(lyricsWithLimit, { to: 'pt' })).text
                const titulo = await tituloOfMusic(musica)

                const helpMsg = new MessageEmbed()
                    .setColor(cor)
                    .setTitle(titulo)
                    .setDescription(lyrics)
                return msg_embed.edit({ embeds: [helpMsg] }).catch(e => { })
            }

            async function searchLyricsQueue(number) {
                const music = queue.songs[number]
                if (!music) {
                    const MsgError = new MessageEmbed()
                        .setColor(cor)
                        .setAuthor({ name: `| Insira uma posição valída da queue.`, iconURL: msg.author.displayAvatarURL() })
                    return msg_embed.edit({ embeds: [MsgError] }).catch(e => { })
                } else {
                    const formatado = titulo_formatado(music.title)
                    return searchLyrics(formatado)
                }
            }

        } catch (e) {
            msg.delete().catch(() => { })
            msg_embed.delete().catch(() => { })
        }

    }


}





