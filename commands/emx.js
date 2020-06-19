const Discord = require("discord.js");
const botconfig = require("../data/botsettings.js");

module.exports.run = async (client, message, args) => {
    message.channel.sendMessage(`Hey! My name is EmX, I'm a multi-purpose bot made for users to have fun and spend their free time with! I hope I can keep you occupied & smiling :)`)
}

module.exports.config = {
    name: "emx",
    description: "A description of my bot EmX",
    usage: "_emx",
    accessableby: "Members",
    aliases: ['_EmX']
}