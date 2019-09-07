const Discord = require("discord.js");
const client = new Discord.Client();



client.on("ready", () => {
    console.log("I am ready!");
    client.user.setStatus('dnd');
    client.user.setActivity('Work In Progress', { type: 2 });
    console.log(`Logged in as ${client.user.tag}!`);



});

client.on('message', message => {
    if (message.content === '_EmX') {
        message.channel.sendMessage(`Hello, I'm a bot in progress right now but if you wish to add me to your server, that's fine! do _invite. You can also learn more about my commands by doing _help`);
    }
    if (message.content === '_help') {
        const exampleEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help')
            .setDescription('Here are the bot commands! Use ``_help command name`` for help on usage. **Case Sensitive**')
            .setThumbnail('https://i.ibb.co/gMS6gX4/mono.png')
            .addBlankField()
            .addField('_EmX', 'Simply describes the bot')
            .addBlankField()
            .addField('_Invite', 'Gives you an invite link to bring the bot to your server', true)
            .addBlankField()
            .addField('_Tree', 'Plants a tree at will', true)
            .addBlankField()
            .addField('_Dog', 'Sends a randomly generated picture of a doggo', true)
            .addBlankField()
            .addField('_Cat', 'Sends a randomly generated picture of a cat', true)
            .addBlankField()
            .addField('_Random', 'Sends a randomly generated picture of any random picture in the internet', true)
            .setFooter('Bot created by Sattish#2011', 'https://i.ibb.co/gMS6gX4/mono.png');
        message.channel.sendMessage(exampleEmbed)
    }
    if (message.content === '_help Invite') {
        const InviteEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help about Invitation')
            .setDescription('Bot sends a link which will allow you to bring the bot to your server!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Invite | _invite')
        message.channel.sendMessage(InviteEmbed)
    }
    if (message.content === '_help Tree') {
        const TreeEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help on how to water a tree')
            .setDescription('Are you really asking a bot for help on watering a tree? **Amateur**')
            .addField('Aliases')
            .addBlankField()
            .addField('_Tree | _tree')
        message.channel.sendMessage(TreeEmbed)
    }
    if (message.content === '_help Dog') {

        const DogEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help about Doggos')
            .setDescription('Bot sends a randomized picture of a doggo from the internet! If a picture shows up again, thats because its a randomized system and the bot could choose any photos at all!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Dog | _dog')
        message.channel.sendMessage(DogEmbed)
    }
    if (message.content === '_help Cat') {

        const CatEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help about Fluff Cats')
            .setDescription('Bot sends a randomized picture of a cattos from the internet! If a picture shows up again, thats because its a randomized system and the bot could choose any photos at all!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Cat | _cat')
        message.channel.sendMessage(CatEmbed)
    }
    if (message.content === '_help Random') {

        const RandEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help about Random pictures')
            .setDescription('Bot sends a randomized picture from the internet! If a picture shows up again, thats because its a randomized system and the bot could choose any photos at all!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Random | _random | _Rand | _rand')
        message.channel.sendMessage(RandEmbed)
    }
    if (message.content === '_invite') {


        const InvEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=67584&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Fapi%2Foauth2%2Fauthorize%3Fclient_id%3D612536352751353886%26permissions%3D8%26scope%3Dbot&scope=bot')
        message.channel.sendMessage(InvEmbed)
    }
    if (message.content === '_Invite') {
        message.channel.sendMessage(InvEmbed)
    }
    function Cat8ball() {
        var rand = ['http://bit.ly/2k0cr31', 'http://bit.ly/2lwabAZ', 'http://bit.ly/2lw5pTU', 'http://bit.ly/2lw5DKK', 'http://bit.ly/2jURKW0', 'http://bit.ly/2kfOhlg', 'http://bit.ly/2kpdVUB', 'http://bit.ly/2jWmtlx', 'http://bit.ly/2lPAXnQ', 'http://bit.ly/2ltsu9Z', 'http://bit.ly/2lzSDDO', 'http://bit.ly/2lttRFF'];

        return rand[Math.floor(Math.random() * rand.length)];
    }
    if (message.content === '_Cat') {
        message.channel.sendMessage(Cat8ball())
    }
    if (message.content === '_cat') {
        message.channel.sendMessage(Cat8ball())
    }
    function Dog8ball() {
        var james_charles = ['http://bit.ly/2k3xYI8', 'http://bit.ly/2kttQB9', 'http://bit.ly/2jYth2d', 'http://bit.ly/2lCAeGp', 'http://bit.ly/2khbx2i', 'http://bit.ly/2k20Znu ', 'http://bit.ly/2jXMFfB', 'http://bit.ly/2lDfH4z', 'https://bravo.ly/2lwiNaG'];
        return james_charles[Math.floor(Math.random() * james_charles.length)];
    }

    if (message.content === '_Dog') {
        message.channel.sendMessage(Dog8ball())
    }
    if (message.content === '_dog') {
        message.channel.sendMessage(Dog8ball())
    }
    function Random() {
        var Random = ['http://bit.ly/2jZ2B1c', 'http://bit.ly/2khlyMY', 'http://bit.ly/2lwkfd8', 'http://bit.ly/2ktyorc', 'http://bit.ly/2k3ACO4', 'http://bit.ly/2kirdlV', 'http://bit.ly/2jYvV89', 'http://bit.ly/2ktWjab', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2lwJ3BK', 'Fun Fact: This Cat beat my maker up! http://bit.ly/2ktz9Ay', 'http://bit.ly/2kqGEZb', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2k24CK8'];
        return Random[Math.floor(Math.random() * Random.length)];
    }
    if (message.content === '_random') {
        message.channel.sendMessage(Random())
    }
    if (message.content === '_Random') {
        message.channel.sendMessage(Random())
    }

    if (message.content === '_rand') {
        message.channel.sendMessage(Random())
    }
    if (message.content === '_Rand') {
        message.channel.sendMessage(Random())
    }
    if (message.content.toLowerCase() === '_tree') {
        message.channel.sendMessage(`A tree was watered! Thanks!`)
        message.channel.sendMessage(`https://tenor.com/view/clown-gif-10162552`)
    }
    // if (message.content === '_Tree') {
    //     message.channel.sendMessage(`A tree was watered! Thanks!`)
    //     message.channel.sendMessage(`https://tenor.com/view/clown-gif-10162552`)
    // }


});



client.login(process.env.token);
