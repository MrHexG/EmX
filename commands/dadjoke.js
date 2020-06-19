const dadjoke = require('../data/dadjoke.json');
const Discord = require("discord.js");
const botconfig = require("../data/botsettings.js");

module.exports.run = async (bot, message, args) => {
    args = args.join(" ");
    message.channel.send(`${dadjoke[Math.floor(Math.random() * dadjoke.length)]}`);
}


module.exports.config = {
    name: "dadjoke",
    description: "Sends a terrible dad joke",
    usage: "_dadjoke",
    accessableby: "Members",
    aliases: []
}
