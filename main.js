const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

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




client.on("ready", () => {
    console.log("I am ready!");
    client.user.setStatus('dnd');
    client.user.setActivity('Work In Progress', { type: 2 });
    console.log(`Logged in as ${client.user.tag}!`);
   
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
        const last_tree = await Tree.findOne({ user_id: user }).sort({created_at: -1});
        console.log(isWateringAllowed(last_tree.planted_time));
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
        console.log(moment.duration(moment(new Date()).diff(moment(start_time))).asHours());
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
});
// waterTree('375615842777432064');

client.on('message', message => {
    if (!message.guild) return;
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
     if (!message.guild) return;
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
        
    if (!message.guild) return;

   
});
client.on('guildMemberAdd', member => {

    const channel = member.guild.channels.find(ch => ch.id === '600261959190970374');
   
    if (!channel) return;
   
    channel.send(`Welcome to the server, ${member}, Enjoy your stay!`);
});
const { Client, RichEmbed, Emoji, MessageReaction } = require('discord.js');
const CONFIG = require('./config');

const client = new Client({ disableEveryone: true });
if (CONFIG.botToken === '')
    throw new Error("The 'botToken' property is not set in the config.js file. Please do this!");

client.login(CONFIG.botToken);

// If there isn't a reaction for every role, alert the user
if (CONFIG.roles.length !== CONFIG.reactions.length)
    throw "Roles list and reactions list are not the same length! Please double check this in the config.js file";

// Function to generate the role messages, based on your settings
function generateMessages() {
    return CONFIG.roles.map((r, e) => {
        return {
            role: r,
            message: `React below to get the **"${r}"** role!`, //DONT CHANGE THIS,
            emoji: CONFIG.reactions[e]
        };
    });
}

// Function to generate the embed fields, based on your settings and if you set "const embed = true;"
function generateEmbedFields() {
    return CONFIG.roles.map((r, e) => {
        return {
            emoji: CONFIG.reactions[e],
            role: r
        };
    });
}

// Client events to let you know if the bot is online and to handle any Discord.js errors
client.on("ready", () => console.log("Role Reactions is online!"));
client.on('error', console.error);

// Handles the creation of the role reactions. Will either send the role messages separately or in an embed
client.on("message", message => {
    // Make sure bots can't run this command
    if (message.author.bot) return;

    // Make sure the command can only be ran in a server
    if (!message.guild) return;

    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

    if ((message.author.id !== CONFIG.yourID) && (message.content.toLowerCase() !== CONFIG.setupCMD)) return;

    if (CONFIG.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
        // Here we check if the bot can actually delete messages in the channel the command is being ran in
        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("I need permission to delete your command message! Please assign the 'Manage Messages' permission to me in this channel!");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
    // Here we check if the bot can actually add recations in the channel the command is being ran in
    if (missing.includes('ADD_REACTIONS'))
        throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

    if (!CONFIG.embed) {
        if (!CONFIG.initialMessage || (CONFIG.initialMessage === '')) 
            throw "The 'initialMessage' property is not set in the config.js file. Please do this!";

        message.channel.send(CONFIG.initialMessage);

        const messages = generateMessages();
        for (const { role, message: msg, emoji } of messages) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            message.channel.send(msg).then(async m => {
                const customCheck = message.guild.emojis.find(e => e.name === emoji);
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }).catch(console.error);
        }
    } else {
        if (!CONFIG.embedMessage || (CONFIG.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config.js file. Please do this!";
        if (!CONFIG.embedFooter || (CONFIG.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config.js file. Please do this!";

        const roleEmbed = new RichEmbed()
            .setDescription(CONFIG.embedMessage)
            .setFooter(CONFIG.embedFooter);

        if (CONFIG.embedColor) roleEmbed.setColor(CONFIG.embedColor);

        if (CONFIG.embedThumbnail && (CONFIG.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(CONFIG.embedThumbnailLink);
        else if (CONFIG.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields();
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of CONFIG.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
});

// This makes the events used a bit more readable
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

// This event handles adding/removing users from the role(s) they chose based on message reactions
client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (
        (message.author.id === client.user.id) && (message.content !== CONFIG.initialMessage || 
        (message.embeds[0] && (embedFooterText !== CONFIG.embedFooter)))
    ) {

        if (!CONFIG.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (CONFIG.embed && (message.embeds.length >= 1)) {
            const fields = message.embeds[0].fields;

            for (const { name, value } of fields) {
                if (member.id !== client.user.id) {
                    const guildRole = message.guild.roles.find(r => r.name === value);
                    if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                    }
                }
            }
        }
    }
});

process.on('unhandledRejection', err => {
    const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	console.error("Unhandled Rejection", msg);
});

client.login(process.env.token);
