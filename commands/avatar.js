const Discord = require("discord.js");
const botconfig = require("../files/botsettings.js");

module.exports.run = async (bot, message, args) => {

    message.channel.sendMessage(message.author.displayAvatarURL());

}




module.exports.config = {
    name: "avatar",
    description: "It shows the avatar (icon picture) of the tagged user",
    usage: "_avatar <member>",
    accessableby: "Members",
    aliases: ['avatarURL']
}