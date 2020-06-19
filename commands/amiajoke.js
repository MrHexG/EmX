const Discord = require('discord.js');
const botconfig = require("../data/botsettings.js");


module.exports.run = async (bot, message, args) => {
    let avatar = message.mentions.users.size ? message.mentions.users.first().avatarURL({ format: 'png', dynamic: true, size: 2048 }) : message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 });
  let link = `https://api.alexflipnote.dev/amiajoke?image=${avatar}`
  const embed = new Discord.MessageEmbed()
  .setColor("#800080")
  .setImage(link) 
  .setFooter('EmX by Sattish#2011');
  message.channel.send({embed});

}


module.exports.config = {
    name: "amiajoke",
    description: "Puts AM I A JOKE over user's profile picture",
    usage: "_amiajoke",
    accessableby: "Members",
    aliases: []
}