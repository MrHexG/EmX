const Discord = require("discord.js");
const botconfig = require("../data/botsettings.js");

module.exports.run = async (bot, message, args) => {
    if (!args[0]) return message.reply("Please specify the bug. Example:\n`/punch isn't working. It isn't mentioning the user I'm trying to punch`");
    if (args[0] === "bug") return message.reply("Please specify the bug. Example:\n`/punch isn't working. It isn't mentioning the user I'm trying to punch`");
    args = args.join(" ");
    message.reply("Thanks for submitting a bug! <a:balancecheck:556017659419033653>");
    const content = `**${message.author.username}#${message.author.discriminator}** (${message.author.id}) reported:\n~~--------------------------------~~\n${args}\n~~--------------------------------~~\nOn the server: **${message.guild.name}**\nServer ID: **${message.guild.id}**`;
    client.channels.cache.get(botconfig.bugchannelid).send(content)
}


module.exports.config = {
    name: "bug",
    description: "Returns bug to the #bug-reports channel in support server",
    usage: "_bug",
    accessableby: "Members",
    aliases: []
}