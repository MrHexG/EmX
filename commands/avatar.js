const Discord = require("discord.js");
const botconfig = require("../files/botsettings.js");

module.exports.run = async (bot, message, args) => {
    let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({ format: 'png', dynamic: true, size: 2048 }) : message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 });
    if (message.mentions.users.size > 0) {
      const embed = new Discord.MessageEmbed()
        .setColor(0xFFFF00)
        .setTitle(`Avatar for ${message.mentions.users.first().username}:`)
        .setImage(`${avatar}`)
        .setFooter('EmX by Sattish#2011');
        message.channel.send({embed});
    } else {
      const embed = new Discord.MessageEmbed()
      .setColor(0xFFFF00)
      .setTitle(`Avatar for ${message.author.username}:`)
      .setImage(`${avatar + "?size=2048"}`)
      .setFooter('EmX by Sattish#2011');
      message.channel.send({embed});
    }
}




module.exports.config = {
    name: "avatar",
    description: "It shows the avatar (icon picture) of the tagged user",
    usage: "_avatar <member>",
    accessableby: "Members",
    aliases: ['avatarURL']
}