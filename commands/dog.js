const Discord = require("discord.js");
const botconfig = require("../data/botsettings.js");
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
        fetch('https://api.thedogapi.com/v1/images/search')
        .then(res => res.json())
        .then(data => { 
        result = (data[0].url)

    const DogEmbed = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Take this doggo!')
        .setImage(result)
    message.channel.send(DogEmbed)
    })
}

module.exports.config = {
    name: "dog",
    description: "Sends Dog Pictures from the Dog API",
    usage: "_dog",
    accessableby: "Members",
    aliases: ['Dog']
}