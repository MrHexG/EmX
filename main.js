const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('./dbHandler.js')
const fetch = require('node-fetch');
const moment = require('moment');
const mongoose = require('mongoose');
const util = require('./util.json');

// mongoose.connect(process.env.mongo_conn_string || 'mongodb+srv://emx_db:0pBfRLn1SxL257kq@emx-l9d4w.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log('DB connected!')
// });

// Setting up Hangman Topics
var prefix = "_";
var topics = ["", "Countries", "Capital Cities", "Food", "Movies", "Bands",
 "Animals", "Computers", "Compound Words", "Pokémon"];
//var botOn = false;
var gameOn = false;
var nonAlphaFlag = false;
var randNum;

// Hangman Game Variables
var playWord = "";
var boardWord = "";
var damage = 0;
var guessedList = "";
var solvedList = []

var missList = "Missed Guesses: ";
var helperTopic = "Topic: ";
var helperBoard = new Discord.RichEmbed();
var gameBoard = new Discord.RichEmbed();
var hangASCII = [
"+---------+\n |                |\n                  |\n                  |\n                  |\n                  |\n                  |\n                  |\n===============\n",
"+---------+\n |                |\nO               |\n                  |\n                  |\n                  |\n                  |\n                  |\n===============\n",
"+---------+\n |                |\nO               |\n |                |\n                  |\n                  |\n                  |\n                  |\n===============\n",
"+---------+\n  |               |\n O              |\n/|               |\n                  |\n                  |\n                  |\n                  |\n===============\n",
"+---------+\n  |               |\n O              |\n/|\\            |\n                  |\n                  |\n                  |\n                  |\n===============\n",
"+---------+\n  |               |\n O              |\n/|\\            |\n/                |\n                  |\n                  |\n                  |\n===============\n",
"+---------+\n  |               |\n O              |\n/|\\            |\n/ \\            |\n                  |\n                  |\n                  |\n===============\n"
]
var healthCode = ["0022FF", "00EFFF", "2BFF00", "F7FF00", "FF7700", "FF0000", "000000"]

var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

var bm ="";
var correctAnswer = "";
var mainMenu = new Discord.RichEmbed()
    .setTitle("Topic Select")
    .setDescription("Please select a topic by typing in '_topic <number>' ")
    .addField(reaction_numbers[1]+" "+topics[1], "-----------")
    .addField(reaction_numbers[2]+" "+topics[2], "-----------")
    .addField(reaction_numbers[3]+" "+topics[3], "-----------")
    .addField(reaction_numbers[4]+" "+topics[4], "-----------")
    .addField(reaction_numbers[5]+" "+topics[5], "-----------")
    .addField(reaction_numbers[6]+" "+topics[6], "-----------")
    .addField(reaction_numbers[7]+" "+topics[7], "-----------")
    .addField(reaction_numbers[8]+" "+topics[8], "-----------")
    .addField("⭕ Dynamic Topics ⭕", "These topics contain subcategories and are accessed by:\n '_topic <subcategory>")
    .addField("⭕ Pokemon", "Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola ")
    .setThumbnail("https://cdn3.iconfinder.com/data/icons/brain-games/128/Hangman-Game.png")
    .setColor('1BB2F3')

var helpBoard = new Discord.RichEmbed()
    .setTitle("Help")
    .addField("_topic <number>", "Starts a game with the chosen topic")
    .addField("_topic <category>", "Starts a game with the chosen dynamic topic")
    .addField("_guess <letter>", "Guesses a letter in the game")
    .addField("_solve '<string>'", "Attempts to end the game by solving the word")
    .setColor('0022FF')

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
    let guild = client.users.size
    console.log(guild)
let statuses = ['try _cat & _dog 😏','_help | _invite'];
    setInterval(function(){
        let status = statuses[Math.floor(Math.random()*statuses.length)];
        // using setPresence()
        client.user.setPresence({ game: { name:status},status: 'dnd' });
        // client.user.setPresence({ activity: { name: status }, status:'online' });

    }, 5000) // Runs interval every 5 seconds
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
    client.on('message', function(message) {


    var msg = message.content;
    msg = msg.toLowerCase();
    if (msg == prefix+'topic'){
        if (gameOn === false){
          //Display the topic menu
            message.channel.sendEmbed(mainMenu)
        } else {
            bm = badManners();
            message.reply("The game is already on, "+bm)
                .then(msg => {
                    msg.delete(8000)
                })
        }
    }

    if (msg == prefix+'help hangman'){
        message.channel.sendEmbed(helpBoard)
    }

    //Take guesses here
    if (gameOn === true){

        // Check if it is alhpabetical, eight characaters long, is not _solve, and starts with prefix
        if (msg.includes("guess") && alphaCheck(msg.charAt(7)) !== null && msg.length === 8 && msg.charAt(0) === prefix && !msg.includes("_solve")){
            var guess = msg.charAt(7);
            //Check if duplicate
            var doubleFlag = checkIfGuessed(guessedList, guess);
            if (doubleFlag === true){
                bm = badManners();
                message.reply("That has been guessed, "+bm)
                    .then(msg => {
                        msg.delete(8000)
                    })                
            } else {
                //Check if it exists in string
                var l;
                var passFlag = false;
                for (l = 0; l < playWord.length; l++){
                    if (playWord[l] === guess){
                        boardWord = replaceAt(boardWord, l, guess);
                        passFlag = true;
                    }
                }

                guessedList = guessedList + guess;

                // If this is true, it was correct. Display board and check if winner
                if (passFlag === true){
                    //Print the board
                    gameBoard
                        .setTitle(hangASCII[damage])
                        .setFooter(boardWord)
                        .setColor(healthCode[damage])
                    message.channel.sendEmbed(gameBoard);

                    //Check if winner
                    if (boardWord === playWord){

                        helperBoard
                            .setTitle("Congratulations!")
                            .setFooter("You Win!")
                            .setColor(healthCode[damage])
                        message.channel.sendEmbed(helperBoard);

                        resetGame();
                    } else {
                        //Print normally
                        helperBoard
                            .setTitle(helperTopic)
                            .setFooter(missList)
                            .setColor(healthCode[damage])
                        message.channel.sendEmbed(helperBoard);
                    }

                } else {
                // Missed! Deduct health and display board
                    damage = damage + 1;
                    missList = missList + " " + guess;

                    //Print the board
                    gameBoard
                        .setTitle(hangASCII[damage])
                        .setFooter(boardWord)
                        .setColor(healthCode[damage])
                    message.channel.sendEmbed(gameBoard);

                    // If dead, print the "You Lose" screen and reset game
                    if (damage === 6){

                        correctAnswer = "The correct answer was: "+playWord;

                        helperBoard
                            .setTitle("You Lose!")
                            .setFooter(correctAnswer)
                            .setColor(healthCode[damage])
                        message.channel.sendEmbed(helperBoard);

                        resetGame();
                    } else {
                    // Not dead, print normal helper board
                    helperBoard
                        .setTitle(helperTopic)
                        .setFooter(missList)
                        .setColor(healthCode[damage])
                    message.channel.sendEmbed(helperBoard);
                    }
                }
            }

        } else if (msg.includes("solve") && msg.charAt(0) === prefix && msg.charAt(msg.length-1) == "'"){
            //Make sure there are only two quotes in the solve string
            if (findTwoQuotes(msg) === true){
                var solv = msg.split("_solve ");
                solv = solv + '';
                solv = solv.split("'")[1];

                alreadyGuessed = false;

                //Check if guess is only alphabetical
                var c = 0;
                nonAlphaFlag = true;
                for (c = 0; c < solv.length; c++){
                    if (solv.charAt(c) === null){
                        nonAlphaFlag = false;
                    }
                }
                //Check if it was already guessed
                for (c = 0; c < solvedList.length; c++){
                    if (solv == solvedList[c]){
                        alreadyGuessed = true;
                    }
                }
                //It passed. Proceed to check
                if (nonAlphaFlag === true && alreadyGuessed === false){
                    //Continue by checking length of solv + length of command + the two quotes
                    // This will make sure it only accepts valid input <_solve ''> this ahs 9 chars
                    if ((solv.length + 9) === msg.length){
                        //Check if winner
                        if (solv === playWord){
                            boardWord = playWord;

                            gameBoard
                                .setTitle(hangASCII[damage])
                                .setFooter(boardWord)
                                .setColor(healthCode[damage])
                            message.channel.sendEmbed(gameBoard);
    
                            helperBoard
                                .setTitle("Congratulations!")
                                .setFooter("You Win!")
                                .setColor(healthCode[damage])
                            message.channel.sendEmbed(helperBoard);

                            resetGame();
                        } else {
                            // Missed! Deduct health and display board
                            damage = damage + 1;
                            missList = missList + " '" + solv+"'";
                            solvedList.push(solv)

                            //Print the board
                            gameBoard
                                .setTitle(hangASCII[damage])
                                .setFooter(boardWord)
                                .setColor(healthCode[damage])
                            message.channel.sendEmbed(gameBoard);

                            if (damage === 6){

                                correctAnswer = "The correct answer was: "+playWord;

                                helperBoard
                                    .setTitle("You Lose!")
                                    .setFooter(correctAnswer)
                                    .setColor(healthCode[damage])
                                message.channel.sendEmbed(helperBoard);

                                resetGame();
                            } else {
                            helperBoard
                                .setTitle(helperTopic)
                                .setFooter(missList)
                                .setColor(healthCode[damage])
                            message.channel.sendEmbed(helperBoard);
                            }
                        }
                    }
                } else {
                    //Invalid input: Already guessed
                    if (alreadyGuessed === true){
                        bm = badManners();
                        message.reply("This has been guessed, "+bm)
                            .then(msg => {
                                msg.delete(8000)
                            })
                    } else {
                    //Invalid input: non Alpha solve
                    bm = badManners();
                    message.reply("Guesses should only contain alphabetical characters, "+bm)
                        .then(msg => {
                            msg.delete(8000)
                        })
                    }  
                }
            } else {
                //Invalid input: Unrecognized input
                message.reply("Guesses should be alphabetical.")
                //Check if Invalid Guess
                if (msg.startsWith(prefix+"guess " && alphaCheck(msg.charAt(7)) != null) ){
                    message.reply("Guesses should be alphabetical.")   
                }
            }
        }
        if (msg.startsWith(prefix+"guess ")  && (alphaCheck(msg.charAt(7)) == null || msg.length !== 8  )){
            message.reply("Guesses should be a single alphabetical character.")   
        }
    }
    // Topic selection check
    if (/*botOn === true && */gameOn === false){
        if ((msg == prefix+'topic 1') || (msg == prefix+'topic one') || (msg == prefix+'topic '+reaction_numbers[1]) || (msg == prefix+'topic countries')){
            console.log('Playing Countries')
            playWord = getPlayWord(util.country, util.numCountry);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[1];
        } else if ((msg == prefix+'topic 2') || (msg == prefix+'topic two') || (msg == prefix+'topic '+reaction_numbers[2]) || (msg == prefix+'topic capital cities')){
            console.log('Playing Cities')
            playWord = getPlayWord(util.capitalcity, util.numCities);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[2];
        } else if ((msg == prefix+'topic 3') || (msg == prefix+'topic three') || (msg == prefix+'topic '+reaction_numbers[3]) || (msg == prefix+'topic food')){
            console.log('Playing Foods')
            playWord = getPlayWord(util.food, util.numFoods);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[3];
        } else if ((msg == prefix+'topic 4') || (msg == prefix+'topic four') || (msg == prefix+'topic '+reaction_numbers[4]) || (msg == prefix+'topic movies')){
            console.log('Playing Movies')
            playWord = getPlayWord(util.movie, util.numMovies);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[4];
        } else if ((msg == prefix+'topic 5') || (msg == prefix+'topic five') || (msg == prefix+'topic '+reaction_numbers[5]) || (msg == prefix+'topic bands')){
            console.log('Playing Bands')
            playWord = getPlayWord(util.band, util.numBands);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[5];
        } else if ((msg == prefix+'topic 6') || (msg == prefix+'topic six') || (msg == prefix+'topic '+reaction_numbers[6]) || (msg == prefix+'topic animals')){
            console.log('Playing Animals')
            playWord = getPlayWord(util.animal, util.numAnimals);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[6];
        } else if ((msg == prefix+'topic 7') || (msg == prefix+'topic seven') || (msg == prefix+'topic '+reaction_numbers[7]) || (msg == prefix+'topic computers')){
            console.log('Playing Computers')
            playWord = getPlayWord(util.computer, util.numComputers);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[7];
        } else if ((msg == prefix+'topic 8') || (msg == prefix+'topic eight') || (msg == prefix+'topic '+reaction_numbers[8]) || (msg == prefix+'topic compound words')){
            console.log('Playing Compound Word')
            playWord = getPlayWord(util.compoundWord, util.numComputers);
            console.log(playWord);
            gameOn = true;

            helperTopic = helperTopic + topics[8];
        // Dynamic Topic
        } else if (msg.startsWith(prefix+"topic")){
            if ((msg == "_topic pokemon kanto") || (msg == "_topic kanto")){
                randNum = Math.floor(Math.random() * 151);
                playWord = util.pokemon[randNum]
                console.log(playWord);
                gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Kanto)";
            } else if ((msg == "_topic pokemon johto") || (msg == "_topic johto")){
                randNum = Math.floor(Math.random() * 100) + 151;
                playWord = util.pokemon[randNum]
                console.log(playWord);
                gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Johto)";
            } else if ((msg == "_topic pokemon hoenn") || (msg == "_topic hoenn")){
                randNum = Math.floor(Math.random() * 136) + 251;
                playWord = util.pokemon[randNum]
                console.log(playWord);
                gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Hoenn)";
            } else if ((msg == "_topic pokemon sinnoh") || (msg == "_topic sinnoh")){
                 randNum = Math.floor(Math.random() * 107) + 386;
                 playWord = util.pokemon[randNum]
                 console.log(playWord);
                 gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Sinnoh)";
            } else if ((msg == "_topic pokemon unova") || (msg == "_topic unova")){
                randNum = Math.floor(Math.random() * 156) + 492;                 
                playWord = util.pokemon[randNum]
                console.log(playWord);
                gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Unova)";
            } else if ((msg == "_topic pokemon kalos") || (msg == "_topic kalos")){
                console.log(util.pokemon[720]+" and "+util.pokemon[721])
                randNum = Math.floor(Math.random() * 72) +649;                 
                playWord = util.pokemon[randNum]
                console.log(playWord);
                gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Kalos)";
            } else if ((msg == "_topic pokemon alola") || (msg == "_topic alola")){
                console.log(util.pokemon[806]+"Is pokemon")
                randNum = Math.floor(Math.random() * 86) +721;                 
                playWord = util.pokemon[randNum]
                console.log(playWord);
                gameOn = true;
     
                helperTopic = helperTopic + topics[9]+" (Alola)";
            } else if (msg == prefix+'topic pokemon'){
                playWord = getPlayWord(util.pokemon, util.numPokemon);
                console.log(playWord);
                gameOn = true;
    
                helperTopic = helperTopic + topics[9];
            } 
        }
        //generate the board
        if (gameOn === true){

            boardWord = generateBoardWord(playWord);
            gameBoard
                .setTitle(hangASCII[damage])
                .setColor('GREEN')
                .setFooter(boardWord)
                .setColor(healthCode[damage])
            message.channel.sendEmbed(gameBoard);

            helperBoard
                .setTitle(helperTopic)
                .setFooter(missList)
                .setColor(healthCode[damage])
            message.channel.sendEmbed(helperBoard);
        }
    }
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
        const helpEmbed = new Discord.RichEmbed()
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
            .setFooter('Bot created by Sattish#2011 & TheKarlos#5992', 'https://i.ibb.co/gMS6gX4/mono.png');
        message.channel.sendMessage(helpEmbed)
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
    var Josua = ['https://i.imgur.com/uqWrcFg.jpg','https://i.imgur.com/0PfxLFn.jpg', 'https://i.imgur.com/lv5rwu3.jpg', 'https://i.imgur.com/fL5ssch.jpg', 'https://i.imgur.com/ydNN86H.jpg', 'https://i.imgur.com/bQmntav.jpg', 'https://i.imgur.com/nx0WQ80.png', 'https://i.imgur.com/XeUA4nc.png', 'https://i.imgur.com/slQpHbY.png', 'https://i.imgur.com/QutTMUS.png', 'https://i.imgur.com/jVQFCom.png', 'https://i.imgur.com/mUEYcT0.png', 'https://i.imgur.com/sOfoEuz.png', 'https://i.imgur.com/6FvtuWZ.png', 'https://i.imgur.com/BK7u8vp.png', 'https://i.imgur.com/D4EtAmW.png', 'https://i.imgur.com/umXHXhT.png', 'https://i.imgur.com/ueYmUxK.png']
    return Josua[Math.floor(Math.random() * Josua.length)];
        
    }
    if (message.content.toLowerCase() === '_daniel') {
        message.channel.sendMessage(Daniel())   
    }
    function Daniel() {
        var daniel = ['https://i.imgur.com/2Gr08Pe.jpg','https://i.imgur.com/zjGCgPj.jpg','https://i.imgur.com/gsPwCRV.jpg','https://i.imgur.com/sV2QPi4.jpg','https://i.imgur.com/l5Apozj.jpg','https://i.imgur.com/3MbRKuN.jpg','https://i.imgur.com/j7g7J4T.jpg','https://i.imgur.com/OnuC3dt.jpg','https://i.imgur.com/tHwgRld.jpg','https://i.imgur.com/Ram0h3G.jpg','https://i.imgur.com/86EJF3e.jpg','https://i.imgur.com/AH6njyk.jpg','https://i.imgur.com/gB3zhlR.jpg']
        return daniel[Math.floor(Math.random() * daniel.length)];
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
// Functions
function getPlayWord(topic, numWords){
    var randomNum = Math.floor(Math.random() * numWords);
    return topic[randomNum];
}

function resetGame(){
    //botOn = false;
    gameOn = false;
    playWord = "";
    boardWord = "";
    damage = 0;
    guessedList = "";
    guessedList = []

    missList = "Missed Guesses: ";
    helperTopic = "Topic: ";
}

function findTwoQuotes(string){
    var j;
    var quotesFound = 0;
    for (j = 0; j < string.length; j++){
        if (string.charAt(j) === "'"){
            quotesFound = quotesFound+1;
        }
    }
    if (quotesFound === 2){
        return true;
    } else {
        return false;
    }
}

function badManners(){
    const badManner = ["nub!", "noob!", "bruh!"];
    var rand = Math.floor(Math.random() * badManner.length);
    return badManner[rand];
}

//All functions below this comment were repurposed from my Oatmeal Bot
function generateBoardWord(gameWord){
    var i;
    var bWord = "";
    for (i = 0; i < gameWord.length; i++){
        if (gameWord[i] === ' '){
            bWord = bWord + ' ';
        } else {
            bWord = bWord + '-';
        }
    }

    return bWord;
}

function alphaCheck(input){
    return input.match("^[a-zA-Z]+$");    
}

function checkIfGuessed(gList, guess){
    var j;
    var doubleFlag = false;
    if (gList.length !== undefined){
        for (j = 0; j < gList.length; j++){
            if (gList[j] === guess){
                doubleFlag = true;
            }
        }
    }

    return doubleFlag;
}


function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}
    
client.login(process.env.token);
