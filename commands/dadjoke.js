const dadjoke = require('../files/dadjoke.json');
const Discord = require("discord.js");
const botconfig = require("../files/botsettings.js");

module.exports.run = async (bot, message, args) => {
    args = args.join(" ");
    Dadjoke = dadjoke[Math.floor(Math.random() * dadjoke.length)]
    const dadjokeEmbed = new Discord.MessageEmbed()
    .setColor('#800080')
    .setTitle(Dadjoke)
    .setFooter('Dad Joke')
    message.channel.send(dadjokeEmbed)
}


module.exports.config = {
    name: "dadjoke",
    description: "Sends a terrible dad joke",
    usage: "_dadjoke",
    accessableby: "Members",
    aliases: []
}
