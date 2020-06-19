const Discord = require("discord.js");
const botconfig = require("../data/botsettings.js");
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
    fetch('https://api.thecatapi.com/v1/images/search')
            .then(response => response.json())
            .then(data => {
               result = (data[0].url)
               // console.log(result)
               const CatEmbed = new Discord.MessageEmbed()
               .setColor('#800080')
               .setTitle('Take this catto!')
               .setImage(result)
               message.channel.send(CatEmbed)
            })
}

module.exports.config = {
    name: "cat",
    description: "Sends Cat Pictures from the Cat API",
    usage: "_cat",
    accessableby: "Members",
    aliases: ['Cat']
}