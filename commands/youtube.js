const Discord = require('discord.js');
const { YTSearcher } = require('ytsearcher');
const botconfig = require("../files/botsettings.js");
const searcher = new YTSearcher(botconfig.GoogleApikey);

module.exports.run = async (bot, message, args) => {
    try {
        if (!args[0]) return message.channel.send({embed: {
                color: 800080,
                description: "Please enter a word to search!"
            }})
        
        let msg = await message.channel.send({embed: {
                color: 800080,
                description: "🔎 Searching on Youtube..."
            }})
        
        searcher.search(args.join(' ')).then(info => {
          if (!info.first) {
          let embed2 = new Discord.MessageEmbed()
          .setDescription("I couldn't find anything on Youtube with your query!")
          .setColor('#800080');
           return msg.edit(embed2);
            }
          let embed = new Discord.MessageEmbed()
          .setTitle("🔎 Youtube Search result:")
          .setDescription("`First result:` " + info.first.url + " - " + info.first.title + "\n \`\`\`" + info.first.description + "\`\`\`")
          .setColor('#800080');
          msg.edit(embed);
        });
    
      } catch (err) {
        return message.channel.send({embed: {
                color: 16734039,
                description: "Something went wrong... :cry:"
            }})
      }
    }
    





module.exports.config = {
    name: "youtube",
    description: "Sends youtube search query back",
    usage: "_youtube",
    accessableby: "Members",
    aliases: ['Youtube']
}