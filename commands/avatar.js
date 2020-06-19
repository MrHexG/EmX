const Discord = require("discord.js");
const botconfig = require("../files/botsettings.js");

module.exports.run = async (bot, message, args) => {
  let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({ format: 'png', dynamic: true, size: 2048 }) : message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 });
  const AvatarEmbed = new Discord.MessageEmbed()
  .setColor('#800080')
  .setImage(avatar)
  message.channel.send(AvatarEmbed)
}




module.exports.config = {
    name: "avatar",
    description: "It shows the avatar (icon picture) of the tagged user",
    usage: "_avatar <member>",
    accessableby: "Members",
    aliases: ['avatarURL']
}