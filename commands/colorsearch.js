const Discord = require('discord.js');
const superagent = require('superagent');
const sf = require("snekfetch");
const botconfig = require("../data/botsettings.js");

module.exports.run = async (bot, message, args) => {
    if(!args[0] || args[0] === 'help') return message.reply("Please provide a valid hex code without the #")
  var isOk = /^[0-9A-F]{6}$/i.test(args[0])
  if (isOk === false) return message.reply("Please provide a valid hex code without the #")
  
  const { body } = await superagent
  .get(`https://api.alexflipnote.dev/color/` + args[0]);
  
  const embed = new Discord.MessageEmbed()
  .setColor("#ff9900")
  .setTitle(body.name)
  .setDescription("Hex: " + body.hex + '\n' + "RGB: " + body.rgb)
  .setImage(body.image) 
  .setFooter('EmX by Sattish#2011');
  message.channel.send({embed});

}

module.exports.config = {
    name: "colorsearch",
    description: "Searches for the color using API",
    usage: "_colorsearch",
    accessableby: "Members",
    aliases: ['coloursearch']
}