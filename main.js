const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('./dbHandler.js')
const fetch = require('node-fetch');
const moment = require('moment');
const mongoose = require('mongoose');
const util = require('./util.json');
const HttpUtil = require('./http-util');
// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI('');


// newsapi.v2.topHeadlines({
  //  q: 'george floyd',  // Make the q depending on the user
   // category: 'general', // Mak the category depending on the user
   // language: 'en', // Language depending on the user
   // country: 'us' // Country depending on the user
  // }).then(response => {
  //  console.log(response);
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  // });

// mongoose.connect(process.env.mongo_conn_string, { useNewUrlParser: true });
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
var helperBoard = new Discord.MessageEmbed();
var gameBoard = new Discord.MessageEmbed();
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
var mainMenu = new Discord.MessageEmbed()
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

var helpBoard = new Discord.MessageEmbed()
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
    console.log(client.guilds.size)
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
        message.channel.sendMessage(`Hello, I'm a bot in progress right now but if you wish to add me to your server,  do _invite. You can also learn more about my commands by doing _help`);
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
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help')
            .setDescription('Here are the bot commands! Use ``_help command name`` for help on usage.')
            .setThumbnail('https://i.ibb.co/gMS6gX4/mono.png')
            .addField('• _EmX', 'Simply describes the bot')
            .addField('• _Invite', 'Gives you an invite link to bring the bot to your server', true)
            .addField('• _Support', 'Gives you an invite link to the support server if you have any questions.', true)
            .addField('• _Tree', 'Plants a tree at will, only available every 12 hours!', false)
            .addField('• _Dog', 'Sends a randomly generated picture of a doggo', true)
            .addField('• _Cat', 'Sends a randomly generated picture of a cat', true)
            .addField('• _help hangman','Gives more information on how to play hangman', false)
            .addField('• _help covid', 'Gives more information on how to interact with the COVID-19 API', true)
            .addField('• _udefine <word>', 'Uses Urban Dictionary API to define a word', true)
            .addField('• Message Logs', 'The bot logs all edited and deleted messages into a channel, make a channel called message-logs to access this!', false)
            .setFooter('Bot created by Sattish#2011 & TheKarlos#5992', 'https://i.ibb.co/gMS6gX4/mono.png');
        message.channel.send(helpEmbed)
    }
    
    if (message.content === '_help Invite') {
        const InviteEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help about Invitation')
            .setDescription('Bot sends a link which will allow you to bring the bot to your server!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Invite | _invite')
        message.channel.send(InviteEmbed)
    }
     if (message.content === '_help Support') {
        const SupportingEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help about Support Server')
            .setDescription('Bot sends a link which will send you to the support server where you can ask your questions')
            .addField('Aliases')
            .addBlankField()
            .addField('_Support | _support')
        message.channel.send(SupportingEmbed)
    }
    if (message.content === '_help Tree') {
        const TreeEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help on how to water a tree')
            .setDescription('Are you really asking a bot for help on watering a tree? **Amateur**')
            .addField('Aliases')
            .addBlankField()
            .addField('_Tree | _tree')
        message.channel.send(TreeEmbed)
    }
    if (message.content === '_help Dog') {

        const HelpDogEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help about Doggos')
            .setDescription('Bot sends a randomized picture of a doggo from the internet! If a picture shows up again, thats because its a randomized system and the bot could choose any photos at all!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Dog | _dog')
        message.channel.send(HelpDogEmbed)
    }
    if (message.content === '_help Cat') {

        const HelpCatEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help about Fluff Cats')
            .setDescription('Bot sends a randomized picture of a cattos from the internet! If a picture shows up again, thats because its a randomized system and the bot could choose any photos at all!')
            .addField('Aliases')
            .addBlankField()
            .addField('_Cat | _cat')
        message.channel.send(HelpCatEmbed)
    }

     if (message.content === '_help Avatar') {

        const AvaEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Help about Avatar command')
            .setDescription('If no user mentioned, it will send your avatar and if a user in the server is mentioned, it will send their avatar.')
            .addField('Aliases')
            .addBlankField()
            .addField('_Avatar | _avatar')
        message.channel.send(AvaEmbed)
    }
    if (message.content.toLowerCase() === '_help covid') {
        const CovidHelp = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle("Help about Covid command")
        .addField('_covid','Gives the latest Worldwide COVID-19 Stats ')
        .addField('_covid <country>','Gives the latest COVID-19 Stats about the given country', true)
        .addField('_covid list','Gives a list of all the countries in this API so far.')
        .addField('\u200b','If you\'d like more countries to be added, please DM Sattish#2011', true)
        message.channel.send(CovidHelp)
    
    }
    if (message.content.toLowerCase() === '_invite') {

        const InvEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discordapp.com/api/oauth2/authorize?client_id=612536352751353886&permissions=523328&scope=bot')
        message.channel.send(InvEmbed)
    }
    if (message.content.toLowerCase() === '_support') {

        const SupportEmbed = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle('Heres the link!')
            .setDescription('https://discord.gg/8guM3Yx')
        message.channel.send(SupportEmbed)
    }
    function CovidGlobal() {
    fetch("https://covidapi.info/api/v1/global")
        .then(response => response.json())
        .then(data => {
            confirmed = data.result.confirmed
            recovered = data.result.recovered
            deaths = data.result.deaths
        
            

           const CGlobal = new Discord.MessageEmbed()
            .setColor('#800080')
            .setTitle("Covid-19 Latest Stats Globally")
            .addField('Cases', `${confirmed}`, true)
            .addField('Recovered', `${recovered}`, true)
            .addField('Deaths', `${deaths}`, true)
            .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
          .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
            message.channel.send(CGlobal)
        })
    }
    if (message.content.toLowerCase() === '_covid') {
    CovidGlobal()
    }

function CovidIndia() {

  fetch("https://covidapi.info/api/v1/country/IND/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIndia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in India')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIndia)
    
    })
    .catch(err => {
        console.log('error')
    })
 }
if (message.content.toLowerCase() === '_covid india') {
    CovidIndia()
}

function CovidIndonesia() {
    fetch("https://covidapi.info/api/v1/country/IDN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIndonesia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Indonesia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIndonesia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid indonesia') {
    CovidIndonesia()
}

function CovidAmerica() {
    fetch("https://covidapi.info/api/v1/country/USA/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CAmerica = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in America')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CAmerica)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid america') {
    CovidAmerica()
}

function CovidAustralia() {
    fetch("https://covidapi.info/api/v1/country/AUS/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CAustralia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Australia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CAustralia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid australia') {
    CovidAustralia()
}
function CovidCanada() {
    fetch("https://covidapi.info/api/v1/country/CAN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CCanada = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Canada')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CCanada)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid canada') {
    CovidCanada()
}
function CovidChina() {
    fetch("https://covidapi.info/api/v1/country/CHN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CChina = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in China')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CChina)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid china') {
    CovidChina()
}
function CovidSingapore() {
    fetch("https://covidapi.info/api/v1/country/SGP/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CSingapore = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Singapore')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CSingapore)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid singapore') {
    CovidSingapore()
}
function CovidSpain() {
    fetch("https://covidapi.info/api/v1/country/ESP/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CSpain = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Spain')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CSpain)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid spain') {
    CovidSpain()

}
function CovidItaly() {
    fetch("https://covidapi.info/api/v1/country/ITA/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CItaly = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Italy')
        .addField('• Cases', `${result.confirmed}`, true)
        .addField('• Recovered', `${result.recovered}`, true)
        .addField('• Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CItaly)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid italy') {
    CovidItaly()
}
function CovidGermany() {
    fetch("https://covidapi.info/api/v1/country/DEU/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CGermany = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Germany')
        .addField('• Cases', `${result.confirmed}`, true)
        .addField('• Recovered', `${result.recovered}`, true)
        .addField('• Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CGermany)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid germany') {
    CovidGermany()
}
function CovidFrance() {
    fetch("https://covidapi.info/api/v1/country/FRA/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CFrance = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in France')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CFrance)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid france') {
    CovidFrance()
}
function CovidUK() {
    fetch("https://covidapi.info/api/v1/country/GBR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CUK = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in United Kingdom')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CUK)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid united kingdom') {
    CovidUK()
}
if (message.content.toLowerCase() === '_covid uk') {
    CovidUK()
}
function CovidIran() {
    fetch("https://covidapi.info/api/v1/country/IRN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIran = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Iran')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIran)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid iran') {
    CovidIran()
}
function CovidTurkey() {
    fetch("https://covidapi.info/api/v1/country/TUR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CTurkey = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Turkey')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CTurkey)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid turkey') {
    CovidTurkey()
}
function CovidBelgium() {
    fetch("https://covidapi.info/api/v1/country/BEL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBelgium = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Belgium')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBelgium)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid belgium') {
    CovidBelgium()
}
function CovidNetherlands() {
    fetch("https://covidapi.info/api/v1/country/NLD/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CNetherlands = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Netherlands')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CNetherlands)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid netherlands') {
    CovidNetherlands()
}
function CovidSwitzerland() {
    fetch("https://covidapi.info/api/v1/country/CHE/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CSwitzerland = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Switzerland')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CSwitzerland)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid switzerland') {
    CovidSwitzerland()
}
function CovidBrazil() {
    fetch("https://covidapi.info/api/v1/country/BRA/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBrazil = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Brazil')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBrazil)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid brazil') {
    CovidBrazil()
}
function CovidRussia() {
    fetch("https://covidapi.info/api/v1/country/RUS/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CRussia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Russia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CRussia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid russia') {
    CovidRussia()
}
function CovidPortugal() {
    fetch("https://covidapi.info/api/v1/country/PRT/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CPortugal = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Portugal')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CPortugal)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid portugal') {
    CovidPortugal()
}
function CovidAfghanistan() {
    fetch("https://covidapi.info/api/v1/country/AFG/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CAfghanistan = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Afghanistan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CAfghanistan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid afghanistan') {
    CovidAfghanistan()
}
function CovidAlbania() {
    fetch("https://covidapi.info/api/v1/country/ALB/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CAlbania = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Albania')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CAlbania)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid Albania') {
    CovidAlbania()
}
function CovidArgentina() {
    fetch("https://covidapi.info/api/v1/country/ARG/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CArgentina = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Argentina')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CArgentina)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid argentina') {
    CovidArgentina()
}
function CovidAzerbajian() {
    fetch("https://covidapi.info/api/v1/country/AZE/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CAzerbajian = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Azerbajian')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CAzerbajian)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid azerbajian') {
    CovidAzerbajian()
}
function CovidAzerbajian() {
    fetch("https://covidapi.info/api/v1/country/AZE/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CAzerbajian = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Azerbajian')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CAzerbajian)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid azerbajian') {
    CovidAzerbajian()
}
function CovidBahrain() {
    fetch("https://covidapi.info/api/v1/country/BHR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBahrain = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Bahrain')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBahrain)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid bahrain') {
    CovidBahrain()
}
function CovidBangladesh() {
    fetch("https://covidapi.info/api/v1/country/BGD/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBangladesh = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Bangladesh')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBangladesh)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid bangladesh') {
    CovidBangladesh()
}
function CovidBarbados() {
    fetch("https://covidapi.info/api/v1/country/BRB/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBarbados = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Barbados')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBarbados)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid barbados') {
    CovidBarbados()
}
function CovidBelarus() {
    fetch("https://covidapi.info/api/v1/country/BLR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBelarus = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Belarus')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBelarus)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid belarus') {
    CovidBelarus()
}
function CovidBhutan() {
    fetch("https://covidapi.info/api/v1/country/BTN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBhutan = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Bhutan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBhutan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid bhutan') {
    CovidBhutan()
}
function CovidBolivia() {
    fetch("https://covidapi.info/api/v1/country/BOL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CBolivia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Bolivia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CBolivia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid bolivia') {
    CovidBolivia()
}
function CovidChile() {
    fetch("https://covidapi.info/api/v1/country/CHL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CCHile = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Chile')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CChile)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid chile') {
    CovidChile()
}
function CovidColombia() {
    fetch("https://covidapi.info/api/v1/country/COL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CColombia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Colombia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CColombia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid colombia') {
    CovidColombia()
}
function CovidCote() {
    fetch("https://covidapi.info/api/v1/country/CIV/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CCote = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Cote d\'Ivoire')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CCote)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid cote d ivoire') {
    CovidCote()
}
function CovidCroatia() {
    fetch("https://covidapi.info/api/v1/country/HRV/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CCroatia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Croatia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CCroatia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid croatia') {
    CovidCroatia()
}
function CovidCuba() {
    fetch("https://covidapi.info/api/v1/country/CUB/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CCuba = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Cuba')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CCuba)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid cuba') {
    CovidCuba()
}
function CovidCyprus() {
    fetch("https://covidapi.info/api/v1/country/CYP/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CCyprus = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Cyprus')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CCyprus)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid cyprus') {
    CovidCyprus()
}
function CovidDenmark() {
    fetch("https://covidapi.info/api/v1/country/DNK/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CDenmark = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Denmark')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CDenmark)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid denmark') {
    CovidDenmark()
}
function CovidEcuador() {
    fetch("https://covidapi.info/api/v1/country/ECU/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CEcuador = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Ecuador')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CEcuador)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid ecuador') {
    CovidEcuador()
}
function CovidEgypt() {
    fetch("https://covidapi.info/api/v1/country/EGY/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CEgypt = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Egypt')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CEgypt)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid egypt') {
    CovidEgypt()
}
function CovidEthiopia() {
    fetch("https://covidapi.info/api/v1/country/ETH/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CEthiopia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Ethiopia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CEthiopia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid ethiopia') {
    CovidEthiopia()
}
function CovidFinland() {
    fetch("https://covidapi.info/api/v1/country/FIN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CFnland = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Finland')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CFinland)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid finland') {
    CovidFinland()
}
function CovidGhana() {
    fetch("https://covidapi.info/api/v1/country/GHA/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CGhana = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Ghana')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CGhana)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid ghana') {
    CovidGhana()
}
function CovidHungary() {
    fetch("https://covidapi.info/api/v1/country/HUN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CHungary = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Hungary')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CHungary)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid hungary') {
    CovidHungary()
}
function CovidIceland() {
    fetch("https://covidapi.info/api/v1/country/ISL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIceland = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Iceland')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIceland)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid iceland') {
    CovidIceland()
}
function CovidIraq() {
    fetch("https://covidapi.info/api/v1/country/IRQ/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIraq = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Iraq')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIraq)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid iraq') {
    CovidIraq()
}
function CovidIreland() {
    fetch("https://covidapi.info/api/v1/country/IRL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIreland = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Ireland')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIreland)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid ireland') {
    CovidIreland()
}
function CovidIsrael() {
    fetch("https://covidapi.info/api/v1/country/ISR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CIsrael = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Israel')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CIsrael)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid israel') {
    CovidIsrael()
}
function CovidJamaica() {
    fetch("https://covidapi.info/api/v1/country/JAM/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CJamaica = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Jamaica')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CJamaica)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid jamaica') {
    CovidJamaica()
}
function CovidJapan() {
    fetch("https://covidapi.info/api/v1/country/JPN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CJapan = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Japan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CJapan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid japan') {
    CovidJapan()
}
function CovidJordan() {
    fetch("https://covidapi.info/api/v1/country/JOR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CJordan = new Discord.RicMessageEmbedhEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Jordan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CJordan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid jordan') {
    CovidJordan()
}
function CovidKazakhstan() {
    fetch("https://covidapi.info/api/v1/country/KAZ/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CKazakhstan = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Kazakhstan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CKazakhstan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid khazakhstan') {
    CovidKazakhstan()
}
function CovidKenya() {
    fetch("https://covidapi.info/api/v1/country/KEN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CKenya = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Kenya')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CKenya)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid kenya') {
    CovidKenya()
}
function CovidKorea() {
    fetch("https://covidapi.info/api/v1/country/KOR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CKorea = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in South Korea')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CKorea)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid korea')  {
    CovidKorea()
}
if (message.content.toLowerCase() === '_covid south korea')  {
    CovidKorea()
}
function CovidKuwait() {
    fetch("https://covidapi.info/api/v1/country/KWT/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CKuwait = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Kuwait')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CKuwait)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid kuwait')  {
    CovidKuwait()
}
function CovidKyrgyzstan() {
    fetch("https://covidapi.info/api/v1/country/KGZ/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CKyrgyzstan = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Kyrgyzstan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CKyrgyzstan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid kyrgyzstan')  {
    CovidKyrgyzstan()
}
function CovidLebanon() {
    fetch("https://covidapi.info/api/v1/country/LBN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CLebanon = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Lebanon')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CLebanon)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid lebanon')  {
    CovidLebanon()
}
function CovidLibya() {
    fetch("https://covidapi.info/api/v1/country/LBY/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CLibya = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Libya')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CLibya)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid libya')  {
    CovidLibya()
}
function CovidMalaysia() {
    fetch("https://covidapi.info/api/v1/country/MYS/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMalaysia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Malaysia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMalaysia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid malaysia')  {
    CovidMalaysia()
}
function CovidMaldives() {
    fetch("https://covidapi.info/api/v1/country/MDV/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMaldives = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Maldives')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMaldives)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid maldives')  {
    CovidMaldives()
}
function CovidMalta() {
    fetch("https://covidapi.info/api/v1/country/MLT/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMalta = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Malta')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMalta)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid malta')  {
    CovidMalta()
}
function CovidMexico() {
    fetch("https://covidapi.info/api/v1/country/MEX/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMexico = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Mexico')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMexico)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid mexico')  {
    CovidMexico()
}
function CovidMongolia() {
    fetch("https://covidapi.info/api/v1/country/MNG/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMongolia = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Mongolia')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMongolia)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid mongolia')  {
    CovidMongolia()
}
function CovidMorocco() {
    fetch("https://covidapi.info/api/v1/country/MAR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMorocco = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Morocco')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMorocco)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid morocco')  {
    CovidMorocco()
}
function CovidMozambique() {
    fetch("https://covidapi.info/api/v1/country/MOZ/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CKorea = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Mozambique')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMozambique)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid mozambique')  {
    CovidMozambique()
}
function CovidMyanmar() {
    fetch("https://covidapi.info/api/v1/country/MMR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CMyanmar = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Myanmar')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CMyanmar)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid myanmar')  {
    CovidMyanmar()
}
function CovidNepal() {
    fetch("https://covidapi.info/api/v1/country/NPL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CNepal = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Nepal')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CNepal)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid nepal')  {
    CovidNepal()
}
function CovidNewZealand() {
    fetch("https://covidapi.info/api/v1/country/NZL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CNewZealand = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in New Zealand')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CNewZealand)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid new zealand')  {
    CovidNewZealand()
}
function CovidNigeria() {
    fetch("https://covidapi.info/api/v1/country/NGA/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CNigeria = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Nigeria')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CNigeria)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid nigeria')  {
    CovidNigeria()
}
function CovidNorway() {
    fetch("https://covidapi.info/api/v1/country/NOR/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CNorway = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Norway')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CNorway)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid norway')  {
    CovidNorway()
}
function CovidOman() {
    fetch("https://covidapi.info/api/v1/country/OMN/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const COman = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Oman')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(COman)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid oman')  {
    CovidOman()
}
function CovidPakistan() {
    fetch("https://covidapi.info/api/v1/country/PAK/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CPakistan = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Pakistan')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CPakistan)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid pakistan')  {
    CovidPakistan()
}
function CovidParaguay() {
    fetch("https://covidapi.info/api/v1/country/PRY/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CParaguay = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Paraguay')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CParaguay)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid paraguay')  {
    CovidParaguay()
}
function CovidPeru() {
    fetch("https://covidapi.info/api/v1/country/PER/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CPeru = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Peru')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CPeru)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid peru')  {
    CovidPeru()
}
function CovidPhilippines() {
    fetch("https://covidapi.info/api/v1/country/PHL/latest")
    .then(response => response.json())
    .then(data => {
        date = Object.keys(data.result)[0]
        result = data.result[date]
        const CPhilippines = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Covid-19 Latest Stats in Philippines')
        .addField('Cases', `${result.confirmed}`, true)
        .addField('Recovered', `${result.recovered}`, true)
        .addField('Deaths', `${result.deaths}`, true)
        .setFooter('Updated daily @ UTC(00:00) - Data from John Hopkins University (JHU)')
        .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
        message.channel.send(CPhilippines)
    })
    .catch(err => {
        console.log('error')
    })
}
if (message.content.toLowerCase() === '_covid philippines')  {
    CovidPhilippines()
}
 function CovidList() {
    const CList = new Discord.MessageEmbed()
   .setColor('#800080')
    .setTitle('Covid-19 List of Countries Available')
    .addField('\u200b', 'America', true)
   .addField('\u200b', 'Australia ', true)
   .addField('\u200b', 'Afghanistan', true)
     .addField('\u200b', 'Albania', true)
    .addField('\u200b','Argentina', true)
   .addField('\u200b','Azerbajian', true)
  .addField('\u200b','Belgium',true)
    .addField('\u200b', '\Brazil', true)
  .addField('\u200b','Bangladesh', true)
    .addField('\u200b','Barbados', true)
   .addField('\u200b','Belarus', true)
    .addField('\u200b','Bhutan', true)
    .addField('\u200b','Bolivia', true)
    .addField('\u200b','Bolivia', true)
    .addField('\u200b','Canada', true)
    .addField('\u200b','China', true)
    .addField('\u200b','Chile', true)
    .addField('\u200b','Colombia', true)
    .addField('\u200b','Cote D\'Ivoire', true)
    .addField('\u200b','Croatia', true)
    .addField('\u200b','Cuba', true)
    .addField('\u200b','Cyprus', true)
    .addField('\u200b','Denmark', true)
    .addField('\u200b','Ecuador', true)
    .addField('\u200b','Egypt', true)
    .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
    message.channel.send(CList)
  const CList2 = new Discord.MessageEmbed()
    .setColor('#800080')
  .addField('\u200b','Ethiopia', true)
    .addField('\u200b','France', true)
    .addField('\u200b','Finland', true)
    .addField('\u200b','Germany', true)
    .addField('\u200b','Ghana', true)
    .addField('\u200b','Hungary', true)
    .addField('\u200b','India', true)
    .addField('\u200b','Indonesia', true)
    .addField('\u200b','Italy', true)
    .addField('\u200b','Iran', true)
    .addField('\u200b','Iceland', true)
    .addField('\u200b','Iraq', true)
    .addField('\u200b','Ireland', true)
    .addField('\u200b','Israel', true)
    .addField('\u200b','Japan', true)
    .addField('\u200b','Jamaica', true)
    .addField('\u200b','Jordan', true)
    .addField('\u200b','Kazakhstan', true)
    .addField('\u200b','Kenya', true)
    .addField('\u200b','South Korea', true)
    .addField('\u200b','Kuwait', true)
    .addField('\u200b','Kyrgyzstan', true)
    .addField('\u200b','Kuwait', true)
    .addField('\u200b','Lebanon', true)
    .addField('\u200b','Libya', true)
    .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
    message.channel.send(CList2)
  const CList3 = new Discord.MessageEmbed()
    .setColor('#800080')
  .addField('\u200b','Malaysia', true)
    .addField('\u200b','Maldives', true)
    .addField('\u200b','Malta', true)
    .addField('\u200b','Mexico', true)
    .addField('\u200b','Mongolia', true)
    .addField('\u200b','Morocco', true)
    .addField('\u200b','Mozambique', true)
    .addField('\u200b','Myanmar', true)
    .addField('\u200b','Netherlands', true)
    .addField('\u200b','Nepal', true)
    .addField('\u200b','New Zealand', true)
    .addField('\u200b','Nigeria', true)
    .addField('\u200b','Norway', true)
    .addField('\u200b','Oman', true)
    .addField('\u200b','Portugal', true)
    .addField('\u200b','Pakistan', true)
    .addField('\u200b','Paraguay', true)
    .addField('\u200b','Peru', true)
    .addField('\u200b','Philippines', true)
    .addField('\u200b','Russia', true)
    .addField('\u200b','Singapore', true)
    .addField('\u200b','Spain', true)
    .addField('\u200b','Switzerland', true)
    .addField('\u200b','Turkey', true)
    .addField('\u200b','United Kingdom', true)
    .setFooter('If you\'d like more countries to be added, please DM Sattish#2011')
    .setAuthor('Advice for the public (Click Me)', 'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/31-01-20-coronavirus-digital-image-cdc1.jpg/image770x420cropped.jpg', 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public')
 message.channel.send(CList3)
 }

if (message.content.toLowerCase() === '_covid list') {
   CovidList()
 }

    function Cat8ball() {
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
    if (message.content.toLowerCase() === '_cat') {
        Cat8ball()
    }
    function Dog8ball() {
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

    if (message.content.toLowerCase() === '_dog') {
        Dog8ball()
    }
    
    if (message.content.toLowerCase() === '_josua') {
        message.channel.send(Josua())  
    }
    function Josua() {
    var Josua = ['https://i.imgur.com/uqWrcFg.jpg','https://i.imgur.com/0PfxLFn.jpg', 'https://i.imgur.com/lv5rwu3.jpg', 'https://i.imgur.com/fL5ssch.jpg', 'https://i.imgur.com/ydNN86H.jpg', 'https://i.imgur.com/bQmntav.jpg', 'https://i.imgur.com/nx0WQ80.png', 'https://i.imgur.com/XeUA4nc.png', 'https://i.imgur.com/slQpHbY.png', 'https://i.imgur.com/QutTMUS.png', 'https://i.imgur.com/jVQFCom.png', 'https://i.imgur.com/mUEYcT0.png', 'https://i.imgur.com/sOfoEuz.png', 'https://i.imgur.com/6FvtuWZ.png', 'https://i.imgur.com/BK7u8vp.png', 'https://i.imgur.com/D4EtAmW.png', 'https://i.imgur.com/umXHXhT.png', 'https://i.imgur.com/ueYmUxK.png']
    var Josua1 = Josua[Math.floor(Math.random() * Josua.length)];
        const Josh = new Discord.MessageEmbed()
        .setColor("#800080")
        .setTitle("Here it is!")
        .setImage(Josua1)
        message.channel.send(Josh)
    }
    if (message.content.toLowerCase() === '_daniel') {
        message.channel.send(Daniel())   
    }
    function Daniel() {
        var daniel = ['https://i.imgur.com/2Gr08Pe.jpg','https://i.imgur.com/zjGCgPj.jpg','https://i.imgur.com/gsPwCRV.jpg','https://i.imgur.com/sV2QPi4.jpg','https://i.imgur.com/l5Apozj.jpg','https://i.imgur.com/3MbRKuN.jpg','https://i.imgur.com/j7g7J4T.jpg','https://i.imgur.com/OnuC3dt.jpg','https://i.imgur.com/tHwgRld.jpg','https://i.imgur.com/Ram0h3G.jpg','https://i.imgur.com/86EJF3e.jpg','https://i.imgur.com/AH6njyk.jpg','https://i.imgur.com/gB3zhlR.jpg']
        var dan = daniel[Math.floor(Math.random() * daniel.length)];
        const Daniel = new Discord.MessageEmbed()
        .setColor("#800080")
        .setTitle("Here it is!")
        .setImage(dan)
        message.channel.send(Daniel)
    }
        
    function Random() {
        var Random = ['http://bit.ly/2jZ2B1c', 'http://bit.ly/2khlyMY', 'http://bit.ly/2lwkfd8', 'http://bit.ly/2ktyorc', 'http://bit.ly/2k3ACO4', 'http://bit.ly/2kirdlV', 'http://bit.ly/2jYvV89', 'http://bit.ly/2ktWjab', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2lwJ3BK', 'Fun Fact: This Cat beat my maker up! http://bit.ly/2ktz9Ay', 'http://bit.ly/2kqGEZb', 'http://bit.ly/2lXLgX9', 'http://bit.ly/2k24CK8'];
        var rand = Random[Math.floor(Math.random() * Random.length)];
        const random = new Discord.MessageEmbed()
        .setColor("#800080")
        .setTitle("Here it is!")
        .setImage(rand)
        message.channel.send(random)
    }
    if (message.content.toLowerCase() === '_random' || message.content.toLowerCase() === '_rand') {
        message.channel.send(Random())
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
        const last_tree = await Tree.cache.find({ user_id: user }).limit(1).sort({ _id: -1 });
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

    if (message.content.startsWith('_kick')) { // Temporary, will be changed when customizable prefix available
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
    const channel = member.guild.channels.cache.find(ch => ch.id === '600261959190970374');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}, Enjoy your stay!`);
});

// For Urban Dictionary
client.on('message', message => {
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const httpUtil = new HttpUtil();
  
    if(command === "_udefine") {
      if (args.join(" ") < 1){
        message.channel.send('Enter word[s] to define!');
      } else {
        httpUtil.httpsGetText('urbandictionary.com', `define.php?term=${args.join("+")}`)
          .then((text) => {
            let div_regex = /<div class="meaning">(.*?)<\/div>/g;
            let msg = text.match(div_regex);
  
            if (msg === null) {
              message.channel.send(`No result for query ${args.join(" ")}`);
            } else {
              let elem_regex = /<(.*?)>/g;
              let sym_regex = /&(.*?);/g;
              message.channel.send(msg[0].replace(elem_regex, "").replace(sym_regex, ""));
            }
          })
          .catch(e => console.log(e));  
      }   
    }
  });

client.on("messageDelete", message => {// message logs

    const logchannel = message.guild.channels.cache.find(channel => channel.name === "message-logs");
    const user = message.author
    if(!logchannel) return
    let deleteEmbed = new Discord.MessageEmbed()
    .setTitle("⚠️ A message was deleted!")
    .addField("Sent by User", user.tag)
    .addField("Deleted Message", `${message}`) 
    .addField("Deleted In", `${message.guild.channels.cache.get(message.channel.id).toString()}` + ` (${message.channel.id})`)
    .setFooter(`Author ID: ${user.id}| Message ID: ${message.id}`, client.user.avatarURL)
    .setColor("#FF0000")
    logchannel.send(deleteEmbed)
});

client.on("messageUpdate", function(oldMessage, newMessage){

  if(oldMessage.content == newMessage.content) return
    const user = newMessage.author;

  let logsChannel = oldMessage.guild.channels.cache.find(channel => channel.name === "message-logs");

    if(!logsChannel) return

    let messageEditEmbed = new Discord.MessageEmbed()
    .setTitle("⚠️ A message was edited!")
    .addField("Sent by User", user.tag)
    .addField("Before", oldMessage.content)
    .addField("After", newMessage.content)
    .addField("Edited In", `${oldMessage.guild.channels.cache.get(oldMessage.channel.id).toString()}` + ` (${oldMessage.channel.id})`)
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
