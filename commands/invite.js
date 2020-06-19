const Discord = require("discord.js");
const botconfig = require("../files/botsettings.js");

module.exports.run = async (bot, message, args) => {
    const InvEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=523328&scope=bot')
        message.channel.send(InvEmbed)
}


module.exports.config = {
    name: "invite",
    description: "Sends an invite link to add the bot into your server.",
    usage: "_invite",
    accessableby: "Members",
    aliases: ['']
}