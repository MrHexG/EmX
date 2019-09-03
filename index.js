const Discord = require("discord.js");
const client = new Discord.Client();



client.on("ready", () => {
    console.log("I am ready!");
    client.user.setStatus('dnd');
    client.user.setActivity('Work In Progress', { type: 2 });
    console.log(`Logged in as ${client.user.tag}!`);

    
    
});

client.on('message', message => {
    if (message.content.startsWith("_Emx")) {
        message.channel.sendMessage(`Hello, I'm a bot in progress right now but if you wish to add me to your server, that's fine! do _invite`);

    }
    if (message.content === '_invite') {
        message.channel.sendMessage(`https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=67584&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Fapi%2Foauth2%2Fauthorize%3Fclient_id%3D612536352751353886%26permissions%3D8%26scope%3Dbot&scope=bot`)
    }
});



client.login(process.env.token);
