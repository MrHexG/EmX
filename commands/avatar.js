const Discord = require("discord.js");
const botconfig = require("../data/botsettings.js");

module.exports.run = async (bot, message, args) => {
    if (!message.mentions.users.size) {
        
        return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        
        }
        const avatarList = message.mentions.users.map(user => {
        
        return `${user.username}\'s avatar: ${user.displayAvatarURL}`;
        
        });
        
    
        message.channel.send(avatarList);
}




module.exports.config = {
    name: "avatar",
    description: "It shows the avatar (icon picture) of the tagged user",
    usage: "_avatar <member>",
    accessableby: "Members",
    aliases: ['avatarURL']
}