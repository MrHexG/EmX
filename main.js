const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('./dbHandler.js')
const fetch = require('node-fetch');
const moment = require('moment');
const mongoose = require('mongoose');

// mongoose.connect(process.env.mongo_conn_string || 'mongodb+srv://emx_db:0pBfRLn1SxL257kq@emx-l9d4w.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log('DB connected!')
// });

// //DB setup
var treeSchema = new mongoose.Schema({
    user_id: String,
    planted_time: Date
});
treeSchema.methods.getPlantedTime = function () {
    return this.planted_time;
}
var Tree = mongoose.model('Tree', treeSchema);

// var guildSettings = new mongoose.Schema({
//     guild_id: String,
//     prefix: String,
//     disabled: Array
// });
// var GuildSettings = mongoose.model('GuildSettings', guildSettings);

client.on("ready", () => {
    console.log("I am ready!");
    client.user.setStatus('dnd');
    client.user.setActivity('_help | _invite', { type: 3 });
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`Your bot is in ${client.guilds.size} servers!`);
    // Update guild-settings.json to reflect any servers that the bot joined or left while it was offline
    let change = false;
    // If the bot is in any servers that aren't in guild-settings.json, add them
    (client.guilds).forEach((guild) => {
        if (guild !== undefined && !db.guildRetrieve(guild)) {
            db.guildCreate(guild)
            change = true;
        }
    })
});


client.on('message', message => {
    if (message.content === '_EmX') {
        message.channel.sendMessage(`Hello, I'm a bot in progress right now but if you wish to add me to your server, that's fine! do _invite. You can also learn more about my commands by doing _help`);
    }
        
    
if (message.content.startsWith('_avatar')) {
        if (!message.mentions.users.size) {
        
        return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        
        }
        
        
        
        const avatarList = message.mentions.users.map(user => {
        
        return `${user.username}\'s avatar: ${user.displayAvatarURL}`;
        
        });
        
    
        message.channel.send(avatarList);
        }
    
    if (message.content.startsWith('_Avatar')) {
        if (!message.mentions.users.size) {
        
        return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        
        }
        
        
        
        const avatarList = message.mentions.users.map(user => {
        
        return `${user.username}\'s avatar: ${user.displayAvatarURL}`;
        
        });
        
    
        message.channel.send(avatarList);
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
            .addField('_Support', 'Gives you an invite link to the support server if you have any questions.', true)
            .addBlankField()
            .addField('_Tree', 'Plants a tree at will, only available every 12 hours!', true)
            .addBlankField()
            .addField('_Dog', 'Sends a randomly generated picture of a doggo', true)
            .addBlankField()
            .addField('_Cat', 'Sends a randomly generated picture of a cat', true)
            .addBlankField()
            .addField('_Random', 'Sends a randomly generated picture of any random picture in the internet', true)
            .addBlankField()
            .addField('_Avatar', 'Sends you your avatar if no member mentioned, if mentioned, it will send that person\'s avatar', true)
            .addBlankField()
            .addField('Message Logs', 'The bot logs all edited and deleted messages into a channel, please make a channel called message-logs to access this!', true)
            .setFooter('Bot created by Sattish#2011 & TheKarlos#4296', 'https://i.ibb.co/gMS6gX4/mono.png');
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
     if (message.content === '_help Support') {
        const SupportingEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help about Support Server')
            .setDescription('Bot sends a link which will send you to the support server where you can ask your questions')
            .addField('Aliases')
            .addBlankField()
            .addField('_Support | _support')
        message.channel.sendMessage(SupportingEmbed)
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
     if (message.content === '_help Avatar') {

        const AvaEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Help about Avatar command')
            .setDescription('If no user mentioned, it will send your avatar and if a user in the server is mentioned, it will send their avatar.')
            .addField('Aliases')
            .addBlankField()
            .addField('_Avatar | _avatar')
        message.channel.sendMessage(AvaEmbed)
    }
    if (message.content.toLowerCase() === '_invite') {

        const InvEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=523328&scope=bot')
        message.channel.sendMessage(InvEmbed)
    }
    if (message.content.toLowerCase() === '_support') {

        const SupportEmbed = new Discord.RichEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discord.gg/8guM3Yx')
        message.channel.sendMessage(SupportEmbed)
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
    if (message.content.toLowerCase() === '_josua') {
        message.channel.sendMessage(Josua())  
    }
    function Josua() {
    var Josua = ['https://i.imgur.com/0PfxLFn.jpg', 'https://i.imgur.com/lv5rwu3.jpg', 'https://i.imgur.com/fL5ssch.jpg', 'https://i.imgur.com/ydNN86H.jpg', 'https://i.imgur.com/bQmntav.jpg']
    return Josua[Math.floor(Math.random() * Josua.length)];
        
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
        if (rminutes == 60) {
            rhours++;
            rminutes = 0;
        }
        return rhours + " hour(s) and " + rminutes + " minute(s).";
    }
    async function waterTree(user) {
        const last_tree = await Tree.find({ user_id: user }).limit(1).sort({ _id: -1 });
        // console.log(isWateringAllowed(last_tree.planted_time));
        if (isWateringAllowed(last_tree)) {
            console.log("Can water")
            var tree = new Tree({
                user_id: user,
                planted_time: Date.now()
            })
            tree.save(function (err, tree) {
                if (err) return console.error(err);
                message.reply(`thank you for watering a tree. You will be able to water the tree again in 12 hours ${WaterTree8ball()}`)
                
            });
        }
        else {
            message.reply('not enough time has passed since the last time you watered the tree. You will be able to water the tree again in ' + timeConvert(720 - moment.duration(moment(new Date()).diff(moment(last_tree[0].planted_time))).asMinutes()));
        }
    }
    function WaterTree8ball() {
        var watertree = ['https://tenor.com/view/clown-gif-10162552', 'https://tenor.com/view/sprinkle-watering-grow-money-tree-crook-gif-14984898', 'https://tenor.com/view/water-plants-weed-green-watering-gif-5490565'];
        return watertree[Math.floor(Math.random() * watertree.length)];
    }
    
   
    function isWateringAllowed(tree) {
        if (JSON.stringify(tree) == JSON.stringify([])) return true;
        return (moment.duration(moment(new Date()).diff(moment(tree[0].planted_time))).asHours() > 12);
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
    // Karthik is smart
});

//more async functions yayy
// async function guildCreate(guild) {
//     const g = await GuildSettings.findOne({ guild_id: guild.id });
//     if (g == null) {
//         var new_guild = new GuildSettings({
//             guild_id: guild.id,
//             prefix: config.prefix,
//             disabled: []
//         });
//         new_guild.save(function (err, new_guild) {
//             console.log('guild added to DB');
//         })
//     }
// }
// async function guildDelete(guild) {
//     await GuildSettings.findOneAndRemove({ guild_id: guild.id });
// }

// async function guildRetrieve(guild) {
//     return await GuildSettings.findOne({ guild_id: guild.id });
// }
client.on("guildCreate", (guild) => {
    // If the bot joins a server, add it to guild-settings.json and initialize its settings to the default
    db.guildCreate(guild);
});

client.on("guildDelete", (guild) => {
    // If the bot leaves a server, remove it from guild-settings.json
    db.guildDelete(guild);
})

client.on('error', (error) => {
    // Handle client error event
    console.log('Error in main:\n' + error);
})

client.on('message', (message) => {
    const thisGuild = db.guildRetrieve(message.guild);
    if (!message.guild) return;
    // Ignore messages sent by the bot
    if (message.author.bot) {
        return;
    }

    // Ignore messages that don't start with prefix
    if (!message.content.startsWith(thisGuild.prefix)) {
        return;
    }

    // Listen for commands
    let params = message.content.substring(thisGuild.prefix.length).trim().split(' ');
    let command = params.shift();

    if (thisGuild.disabled.includes(command) && !message.member.permissions.has('ADMINISTRATOR')) {
        return;
    }

    if (message.content.startsWith('_kick')) { // Temporary will be changed when customizable prefix available
        if (message.member.permissions.has('ADMINISTRATOR')) {
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.member(user);
                if (member) {
                    member.kick('Optional reason that will be displayed in the audit logs').then(() => {
                        message.reply(`Successfully kicked ${user.tag}`);
                    }).catch(err => {
                        console.error(err);
                    });
                } else {
                    message.reply('That user isn\'t in this guild!');
                }
            } else {
                message.reply('You didn\'t mention the user to kick!');
            }
        } else {
            message.reply('Sorry but you need to be an ``ADMINISTRATOR`` to run this command');
        }
    }

    if (message.content.startsWith('_ban')) { // Temporarily kept as _ban, will change when customizable prefix available
        if (message.member.permissions.has('ADMINISTRATOR')) {
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.member(user);
                if (member) {
                    member.ban({
                        reason: 'They were bad!',
                    }).then(() => {
                        message.reply(`Successfully banned ${user.tag}`);
                    }).catch(err => {
                        message.reply('I was unable to ban the member');
                        // Log the error
                        console.error(err);
                    });
                } else {
                    message.reply('That user isn\'t in this guild!');
                }
            } else {
                message.reply('You didn\'t mention the user to ban!');
            }
        } else {
            message.reply('Sorry but you need to be an ``ADMINISTRATOR`` to run this command');
        }
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
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.id === '600261959190970374');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}, Enjoy your stay!`);
});

client.on("messageDelete", message => {// message logs

    const logchannel = message.guild.channels.find(channel => channel.name === "message-logs");
    const user = message.author
    if(!logchannel) return
    let deleteEmbed = new Discord.RichEmbed()
    .setTitle("⚠️ A message was deleted!")
    .addField("Sent by User", user.tag)
    .addField("Deleted Message", `${message}`) 
    .addField("Deleted In", `${message.guild.channels.get(message.channel.id).toString()}` + ` (${message.channel.id})`)
    .setFooter(`Author ID: ${user.id}| Message ID: ${message.id}`, client.user.avatarURL)
    .setColor("#FF0000")
    logchannel.send(deleteEmbed)
});

client.on("messageUpdate", function(oldMessage, newMessage){

  if(oldMessage.content == newMessage.content) return
    const user = newMessage.author;

  let logsChannel = oldMessage.guild.channels.find(channel => channel.name === "message-logs");

    if(!logsChannel) return

    let messageEditEmbed = new Discord.RichEmbed()
    .setTitle("⚠️ A message was edited!")
    .addField("Sent by User", user.tag)
    .addField("Before", oldMessage.content)
    .addField("After", newMessage.content)
    .addField("Edited In", `${oldMessage.guild.channels.get(oldMessage.channel.id).toString()}` + ` (${oldMessage.channel.id})`)
    .setFooter(`Author ID: ${user.id}| Message ID: ${oldMessage.id}`, client.user.avatarURL)
    .setColor("#FFFF00")
    return logsChannel.send(messageEditEmbed)
});
client.login(process.env.token);
