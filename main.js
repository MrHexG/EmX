const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');
const guildSettings = require('./guild-settings.json');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.connect(process.env.mongo_conn_string || 'mongodb+srv://emx_db:0pBfRLn1SxL257kq@emx-l9d4w.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DB connected!')
});

//DB setup
var treeSchema = new mongoose.Schema({
    user_id: String,
    planted_time: Date
});
treeSchema.methods.getPlantedTime = function () {
    return this.planted_time;
}
var Tree = mongoose.model('Tree', treeSchema);



// waterTree('375615842777432064');
client.on("ready", () => {
    console.log("I am ready!");
    client.user.setStatus('dnd');
    client.user.setActivity('Work In Progress', { type: 2 });
    console.log(`Logged in as ${client.user.tag}!`);
    // Update guild-settings.json to reflect any servers that the bot joined or left while it was offline
    let change = false;
    // If the bot is in any servers that aren't in guild-settings.json, add them
    (client.guilds).forEach((value, key) => {
        if (key !== undefined && !guildSettings[key]) {
            guildSettings[key] = {
                prefix: config.prefix,
                disabled: []
            }
            change = true;
        }
    });

    // If guild-settings.json contains any servers that the bot isn't a member of, remove them
    for (var id in guildSettings) {
        if (!client.guilds.has(id)) {
            delete guildSettings[id];
            change = true;
        }
    }

    if (change) {
        fs.writeFile('./guild-settings.json', JSON.stringify(guildSettings, null, 2), (err) => {
            if (err) {
                console.log('Error adding server to guildSettings.json: ' + err);
            }
        });
    }
});

client.on('message', message => {
    if (message.content === '_EmX') {
        message.channel.sendMessage(`Hello, I'm a bot in progress right now but if you wish to add me to your server, that's fine! do _invite. You can also learn more about my commands by doing _help`);
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
    if (message.content.toLowerCase() === '_invite') {


        const InvEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=523328&scope=bot')
        message.channel.sendMessage(InvEmbed)
    }
    function Cat8ball() {
        fetch('https://api.thecatapi.com/v1/images/search')
            .then(res => res.json())
            .then(data => message.channel.sendMessage(data[0].url))
    }
    if (message.content.toLowerCase() === '_cat') {
        Cat8ball()
    }
    function Dog8ball() {
        fetch('https://api.thedogapi.com/v1/images/search')
            .then(res => res.json())
            .then(data => message.channel.sendMessage(data[0].url))
    }

    if (message.content.toLowerCase() === '_dog') {
        Dog8ball()
    }
    function Random() {
        var Random = ['http://bit.ly/2jZ2B1c', 'http://bit.ly/2khlyMY', 'http://bit.ly/2lwkfd8', 'http://bit.ly/2ktyorc', 'http://bit.ly/2k3ACO4', 'http://bit.ly/2kirdlV', 'http://bit.ly/2jYvV89', 'http://bit.ly/2ktWjab', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2lwJ3BK', 'Fun Fact: This Cat beat my maker up! http://bit.ly/2ktz9Ay', 'http://bit.ly/2kqGEZb', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2k24CK8'];
        return Random[Math.floor(Math.random() * Random.length)];
    }
    if (message.content.toLowerCase() === '_random' || message.content.toLowerCase() === '_rand') {
        message.channel.sendMessage(Random())
    }
    function timeConvert(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours + " hour(s) and " + rminutes + " minute(s).";
    }
    async function waterTree(user) {
        const last_tree = await Tree.findOne({ user_id: user });
        if (!last_tree || isWateringAllowed(last_tree.planted_time)) {
            var tree = new Tree({
                user_id: user,
                planted_time: Date.now()
            })
            tree.save(function (err, tree) {
                if (err) return console.error(err);
                message.reply('thank you for watering a tree. You will be able to water the tree again in 12 hours')
            });
        }
        else {
            message.reply('not enough time has passed since the last time you watered the tree. You will be able to water the tree again in ' + timeConvert(720 - moment.duration(moment(new Date()).diff(moment(last_tree.planted_time))).asMinutes()));
        }
    }
    function isWateringAllowed(start_time) {
        return (moment.duration(moment(new Date()).diff(moment(start_time))).asHours() > 12);
    }
    function getHHMMTime(start_time) {
        return moment.duration(moment(new Date()).diff(moment(start_time))).asHours()
    }
    if (message.content.toLowerCase() === '_tree') {
        // message.channel.sendMessage(`A tree was watered! Thanks!`)
        // message.channel.sendMessage(`https://tenor.com/view/clown-gif-10162552`)
        // checkTimeLimit(getLastWateredTree().getPlantedTime());
        waterTree(message.author.id);
    }
});


client.on("guildCreate", (guild) => {
    // If the bot joins a server, add it to guild-settings.json and initialize its settings to the default
    if (!guildSettings[guild.id]) {
        guildSettings[guild.id] = {
            prefix: config.prefix,
            disabled: []
        }
    }

    fs.writeFile('./guild-settings.json', JSON.stringify(guildSettings, null, 2), (err) => {
        if (err) {
            console.log('Error adding server to guildSettings.json: ' + err);
        }
    });
});

client.on("guildDelete", (guild) => {
    // If the bot leaves a server, remove it from guild-settings.json
    if (guildSettings[guild.id]) {
        delete guildSettings[guild.id];
    }

    fs.writeFile('./guild-settings.json', JSON.stringify(guildSettings, null, 2), (err) => {
        if (err) {
            console.log('Error removing server from guildSettings.json: ' + err);
        }
    });
})

client.on('error', (error) => {
    // Handle client error event
    console.log('Error in main:\n' + error);
})

client.on('message', (message) => {
    // Ignore messages sent by the bot
    if (message.author.bot) {
        return;
    }

    // Ignore messages that don't start with prefix
    if (!message.content.startsWith(guildSettings[message.guild.id].prefix)) {
        return;
    }

    // Listen for commands
    let params = message.content.substring(guildSettings[message.guild.id].prefix.length).trim().split(' ');
    let command = params.shift();

    if (guildSettings[message.guild.id].disabled.includes(command) &&
        !message.member.permissions.has('ADMINISTRATOR')) {
        return;
    }

    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(params, message);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            // Don't report commands that don't exist as this can clash with other bots if prefix is shared
        } else {
            message.channel.send('Error: please check the console for more details');
            console.log(e);
        }
    }
});

client.login(process.env.token);
