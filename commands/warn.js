  
const Discord = require('discord.js');
const botconfig = require("../data/botsettings.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    let reason = args.slice(1).join(' ');
    let user = message.mentions.users.first();
    let warns = JSON.parse(fs.readFileSync("../data/warnings.json", "utf8"));
    //let logchannel = message.guild.channels.find('name', 'logs');
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("❌**Error:** You don't have the **Kick Members** permission!");
    if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
    if (message.mentions.users.first().id === message.author.id) return message.reply('I can\' let you do that, self-harm is bad:facepalm:');
    if (message.mentions.users.first().id === "242263403001937920") return message.reply("You can't warn my Developer:wink:");
    //if (!logchannel) return message.channel.send('I cannot find a logs channel');
    if (reason.length < 1) reason = 'No reason supplied.';
    
    if(!warns[`${user.id}, ${message.guild.id}`]) warns[`${user.id}, ${message.guild.id}`] = {
      warns: 0
    };
  
    warns[`${user.id}, ${message.guild.id}`].warns++;
  
    fs.writeFile("../data/warnings.json", JSON.stringify(warns), err => {
      if(err) throw err;
    });
  
    const embed = new Discord.MessageEmbed()
    .setColor('#800080')
    .setTimestamp()
    .addField('Action:', 'Warning')
    .addField('User:', `${user.username}#${user.discriminator}`)
    .addField('Warned by:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Number of warnings:', warns[`${user.id}, ${message.guild.id}`].warns)
    .addField('Reason', reason)
    .setFooter('EmX by Sattish#2011');
    let logchannel = message.guild.channels.find('name', 'logs');
    if  (!logchannel){
      message.channel.send({embed})
    }else{
      client.channels.get(logchannel.id).send({embed});
      message.channel.send({embed})
    }
    if(user.bot) return;
    message.mentions.users.first().send({embed}).catch(e =>{
      if(e) return 
    });
  
  
    if(warns[`${user.id}, ${message.guild.id}`].warns == 2){
      let muteRole = message.guild.roles.cache.get('723231378061394072');
  
      let mutetime = "60s";
      message.guild.members.get(user.id).addRole('723231378061394072');
      message.reply(`${user.tag} has been temporarily muted`);
  
      setTimeout(function(){
        message.guild.members.get(user.id).removeRole('723231378061394072')
      }, ms(mutetime))
    }
  
    if(warns[`${user.id}, ${message.guild.id}`].warns == 3){
      message.guild.member(user).kick(reason);
      message.reply('The user have been kicked :facepalm:')
    }
  
    if(warns[`${user.id}, ${message.guild.id}`].warns == 5){
      message.guild.member(user).ban(reason);
      message.reply('You won\' have to worry about that shit-head any longer, I have Banned them!');
    }
}


module.exports.config = {
    name: "warn",
    description: "Warns the user for their behaviour",
    usage: "_warn",
    accessableby: "Members",
    aliases: []
}
