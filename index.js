const Discord = require("discord.js");
const client = new Discord.Client();



client.on("ready", () => {
    console.log("I am ready!");
    client.user.setStatus('dnd');
    client.user.setActivity('Work In Progress', { type: 2 });
    console.log(`Logged in as ${client.user.tag}!`);

    
    
});

client.on('message', message => {
    if (message.content.startsWith("_EmX")) {
        message.channel.sendMessage(`Hello, I'm a bot in progress right now but if you wish to add me to your server, that's fine! do _invite. You can also learn more about my commands by doing _help`);
    }
    
    if (message.content === '_invite') {
        message.channel.sendMessage(`https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=67584&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Fapi%2Foauth2%2Fauthorize%3Fclient_id%3D612536352751353886%26permissions%3D8%26scope%3Dbot&scope=bot`)
    }
    function Cat8ball() {
        var rand = ['http://bit.ly/2k0cr31', 'http://bit.ly/2lwabAZ', 'http://bit.ly/2lw5pTU', 'http://bit.ly/2lw5DKK', 'http://bit.ly/2jURKW0', 'http://bit.ly/2kfOhlg', 'http://bit.ly/2kpdVUB', 'http://bit.ly/2jWmtlx', 'http://bit.ly/2lPAXnQ', 'http://bit.ly/2ltsu9Z', 'http://bit.ly/2lzSDDO', 'http://bit.ly/2lttRFF'];

        return rand[Math.floor(Math.random() * rand.length)];
    }
    if (message.content.startsWith("_Cat")) {
        message.channel.sendMessage(Cat8ball())
    }
    if (message.content.startsWith("_cat")) {
        message.channel.sendMessage(Cat8ball())
    }
    function Dog8ball() {
        var Rand = ['http://bit.ly/2k3xYI8', 'http://bit.ly/2kttQB9', 'http://bit.ly/2jYth2d', 'http://bit.ly/2lCAeGp', 'http://bit.ly/2khbx2i', 'http://bit.ly/2k20Znu ', 'http://bit.ly/2jXMFfB', 'http://bit.ly/2lDfH4z', 'https://bravo.ly/2lwiNaG'];
        return Rand[Math.floor(Math.random() * rand.length)];
    }

    if (message.channel.content.startsWith("_Dog")) {
        message.channel.sendMessage(Dog8ball())
    }
    if (message.channel.content.startsWith("_dog")) {
        message.channel.sendMessage(Dog8ball())
    }
    function Random() {
        var Random = ['http://bit.ly/2jZ2B1c', 'http://bit.ly/2khlyMY', 'http://bit.ly/2lwkfd8', 'http://bit.ly/2ktyorc', 'http://bit.ly/2k3ACO4', 'http://bit.ly/2kirdlV', 'http://bit.ly/2jYvV89', 'http://bit.ly/2ktWjab', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2lwJ3BK', 'Fun Fact: This Cat beat my maker up! http://bit.ly/2ktz9Ay', 'http://bit.ly/2kqGEZb', 'http://bit.ly/2lXLgX9','http://bit.ly/2k24CK8'];
        return Random[Math.floor(Math.random() * rand.length)];
    }
    if (message.channel.content.startsWith("_random")) {
        message.channel.sendMessage(Random())
    }
    if (message.channel.content.startsWith("_Random")) {
        message.channel.sendMessage(Random())
    }

    if (message.channel.content.startsWith("_rand")) {
        message.channel.sendMessage(Random())
    }
    if (message.channel.content.startsWith("_Rand")) {
        message.channel.sendMessage(Random())
    }
});



client.login("NjEyNTM2MzUyNzUxMzUzODg2.XW4-vA.D5QaAtLq1u-5Ju5NPnY75VGQOMM");
