const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    
    let helpArray = message.content.split(" ");
    let helpArgs = helpArray.slice(1);

    if(helpArgs[0] === '') {
        return message.reply("")
    }


    if(!helpArgs[0]) {
        var helpembed = new Discord.MessageEmbed()
            .setAuthor(`Here is the Avaible Commands to use:`)
            .setDescription('```meme | udefine (urban dictionary) | mute | unmute | addrole | removerole | cat | dog | kick | ban | clear | hangman | ```')
            .addFields({ name: 'Prefix', value: '```_```', inline: true})
            .setColor('#800080')
            
        message.channel.send(helpembed);
    }

    
    if(helpArgs[0]) {
        let command = helpArgs[0];

        if(bot.commands.has(command)) {
            
            command = bot.commands.get(command);
            var ConfigCommandEmbed = new Discord.MessageEmbed()
            .setAuthor(`${command.config.name} Command`)
            .setDescription(`
            - **Command's Description** __${command.config.description || "There is no Description for this command."}__
            - **Command's Usage:** __${command.config.usage || "No Usage"}__
            - **Command's Permissions:** __${command.config.accessableby || "Members"}__
            - **Command's Aliases:** __${command.config.aliases || "No Aliases"}__
            `)
            .setColor('#2EFF00')

        message.channel.send(ConfigCommandEmbed);
    }}
}

module.exports.config = {
    name: "help",
    description: "",
    usage: "_help",
    accessableby: "Members",
    aliases: []
}