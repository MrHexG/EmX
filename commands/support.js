const Discord = require("discord.js");
const botconfig = require("../botsettings.js");

module.exports.run = async (bot, message, args) => {
    const SupportEmbed = new Discord.MessageEmbed()
    .setColor('#800080')
    .setTitle('Heres the link!')
    .setDescription('https://discord.gg/8guM3Yx')
    message.channel.send(SupportEmbed)
}


module.exports.config = {
    name: "support",
    description: "Sends a link to join the discord support server.",
    usage: "_support",
    accessableby: "Members",
    aliases: []
}