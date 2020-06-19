const Discord = require('discord.js');
const botconfig = require("../data/botsettings.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    let warns = JSON.parse(fs.readFileSync("../data/warnings.json", "utf8"));
    let user = message.mentions.users.first();
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("❌**Error:** You don't have the **Kick Members** permission!");
    if(message.mentions.users.size < 1) return message.reply('You must mention someone to clear their warns.').catch(console.error);
    if(!user) return message.reply("Couldn't find that user...");
    if(!warns[`${user.id}, ${message.guild.id}`]){
    warns[`${user.id}, ${message.guild.id}`] = {
        warns: 0
    };
}
    let reason = `${warns[`${user.id}, ${message.guild.id}`].warns} warnings have been cleared for this person`;
    if(warns[`${user.id}, ${message.guild.id}`].warns > 0) {
        warns[`${user.id}, ${message.guild.id}`] = {
        warns: 0
    };
    }else{
        reason = 'This user doesn\'t have any warnings:wink:'
    };

    fs.writeFile("../data/warnings.json", JSON.stringify(warns), err => {
        if(err) throw err;
      });

    const ClearWarnembed = new Discord.MessageEmbed()
    .setColor(0xFFFF01)
    .setTimestamp()
    .addField('Action:', 'Clear Warns', true)
    .addField('User:', `${user.username}#${user.discriminator}`, true)
    .addField('Result:',reason, true)
    .setFooter('EmX by Sattish#2011');
    message.channel.send({ClearWarnembed});
}


module.exports.config = {
    name: "clearwarns",
    description: "Clear warns for a user",
    usage: "_clearwarns",
    accessableby: "Members",
    aliases: []
}