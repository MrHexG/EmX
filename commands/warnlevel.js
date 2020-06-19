const Discord = require('discord.js');
const botconfig = require("../data/botsettings.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    let warns = JSON.parse(fs.readFileSync("../data/warnings.json", "utf8"));
    let user = message.mentions.users.first();
    if(message.mentions.users.size < 1) return message.reply('You must mention someone to check their warns.').catch(console.error);
    if(!user) return message.reply("Couldn't find that user...");
    if(!warns[user.id]) warns[user.id] = {
      warns: 0
    };

    const embed = new Discord.MessageEmbed()
    .setColor('#800080')
    .setTimestamp()
    .addField('Action:', 'Warn Check')
    .addField('User:', `${user.username}#${user.discriminator}`)
    .addField('Number of warnings:', warns[`${user.id}, ${message.guild.id}`].warns)
    .setFooter('EmX by Sattish#2011');
    message.channel.send({embed});
}



module.exports.config = {
    name: "warnlevel",
    description: "Warn level for a user",
    usage: "_warnlevel",
    accessableby: "Members",
    aliases: []
}