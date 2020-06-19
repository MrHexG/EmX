const Discord = require('discord.js');
const botconfig = require("../botsettings.js");
const HttpUtil = require('../http-util');

module.exports.run = async (bot, message, args) => {
    const args1 = message.content.trim().split(/ +/g);
    const command = args1.shift().toLowerCase();
    const httpUtil = new HttpUtil();
  
    if(command === "_udefine") {
      if (args1.join(" ") < 1){
        message.channel.send('Enter word[s] to define!');
      } else {
        httpUtil.httpsGetText('urbandictionary.com', `define.php?term=${args1.join("+")}`)
          .then((text) => {
            let div_regex = /<div class="meaning">(.*?)<\/div>/g;
            let msg = text.match(div_regex);
  
            if (msg === null) {
              message.channel.send(`No result for query ${args1.join(" ")}`);
            } else {
              let elem_regex = /<(.*?)>/g;
              let sym_regex = /&(.*?);/g;
              message.channel.send(msg[0].replace(elem_regex, "").replace(sym_regex, ""));
            }
          })
          .catch(e => console.log(e));  
      }   
    }


}

module.exports.config = {
	name: "udefine",
	description: "Uses the Urban Dictionary API to find words from the website",
	usage: "_udefine",
	accessableby: "Members",
	aliases: ['']
}