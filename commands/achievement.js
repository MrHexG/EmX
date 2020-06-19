const Discord = require("discord.js");
const botconfig = require("../files/botsettings.js");

module.exports.run = async (bot, message, args) => {
    let text = args.join(" ")
    message.channel.send({files: [{attachment:  `https://api.alexflipnote.dev/achievement?text=${text}`,name: 'file.jpg'}]})
}


module.exports.config = {
    name: "achievement",
    description: "Achievement command ",
    usage: "_achievement",
    accessableby: "Members",
    aliases: []
}