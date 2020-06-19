<img align="right" src="https://i.ibb.co/gMS6gX4/mono.png" height="250" width="250">

# EmX [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Support](https://img.shields.io/badge/support-Discord-blueviolet)](https://discord.io/SZYMusic) [![Quality](https://www.code-inspector.com/project/7148/score/svg)](https://frontend.code-inspector.com/public/project/7148/EmX/dashboard) [![Grade](https://www.code-inspector.com/project/7148/status/svg)](https://frontend.code-inspector.com/public/project/7148/EmX/dashboard)
EmX is an open source discord bot made by discord.js language. It's a language inside of Javascript & node. It lets users interact with the Discord API. I made this bot to have fun & to provide miscellanous commands.

## Star
``PLEASE STAR THIS REPOSITORY TO SUPPORT ME & MY CODING. THANKS!``

## Commands
EmX commands:

_EmX - gives a brief description of the bot.
_help - gievs some of the commands and their info
_invite - Sends an invite link to add the bot into yur server
_support - Sends a link to the support Discord server 

Moderation :
_ban - Bans the tagged user (ADMINISTRATOR perm needed)
_kick - Kicks the tagged user
_clear - Clears a certain number of messages (max 100)
_cooldown - Cooldown on the bot if a command is used over and over again in the span of 2 seconds
_memberinfo / _userinfo - Gives info about the tagged user
_mute / _unmute - Mutes / Unmutes the tagged user.
_addrole / _removerole - Gives tagged user role (DM Me to add your server role into this!)

Fun :
_cat - Sends the picture of a random Cat from the internet!
_dog - Sends the picture of a random Dog from the internet!
_meme - Sends meme from r/meme, r/me_irl, r/dankmeme 
(Let me know if you want any other subreddits!)
_udefine - Searches a word in Urban Dictionary
_hangman - Play hangman with many different topics!
_tree - Plants a tree every 24 Hours!
_covid <country> - Gives COVID-19 info about the selected country.
_youtube <query> - Search youtube for a query and receive a link in return.

## Invite EmX
To invite EmX to your server, just click this ---> [Invite](https://discordapp.com/oauth2/authorize?client_id=612536352751353886&permissions=523328&scope=bot)

## Hosting
``Please do give me the credit if you decide to self-host the bot or use my code.``

If you're choosing to host the bot on your own, the instructions below will help you. If you'd like to contribute and help me add more commands and ideas, contact me via Email (spshewkani@gmail.com) or [Discord](https://discord.io/SZYMusic). `You can also create an Issue in the Issue tab to give me an idea or command that you'd like to see in the future.`

### Prerequisites
What you need to install:
[Visual Studio Code](https://code.visualstudio.com/download) (or you can use any other editor but I prefer it), [Node.js](https://nodejs.org/en/download/)

### Installing
First, install Visual Studio Code & set it up.
Next, install Node.js & complete the setup.
`Make sure that Node & NPM are in PATH`

### Making sure everything is in order
```
Open Command Prompt and do "npm"
```
This is to make sure that npm & nodejs are added into the PATH.

## Deployment
Now via Command Prompt, go to the directory where the github clone repository is in & do `npm i -s`
This will install all the dependencies from the package.json file. 
Next, go to Visual Studio Code and open main.js.
Next, go all the way done and change the `client.login(process.env.token)` to your TOKEN from [Discord](https://discordapp.com/developers), make sure it's like this `client.login(YOUR_TOKEN)`
Next, go to `dbHandler.js` & change the `process.env.mongo_conn_string` to your own TOKEN from [MongoDB](https://www.mongodb.com/).
Finally, go back to the Command Prompt & do `node main.js`, this should run the bot, you should see `DB Connected` show up in the Command Prompt, if it doesn't, you may have done something wrong & can contact me for help.

## Built With

* [Heroku](https://heroku.com/) - Where the bot is hosted 24/7
* [Visual Studio Code](https://code.visualstudio.com/download) - Editor used.
* [Node.js](https://nodejs.org/) - Environment used to interact
* [Discord.js](https://discord.js.org/) - The powerful node.js module that allowed me to interact with the Discord API
* [MongoDB](https://www.mongodb.com/) - The database used to log a user's time taken for `_tree` command.

## Big Thanks
A very big thanks to [**Karthikeyan Arumugam**](https://github.com/kamtechie) who helped in many different commands & ideas. Thanks bro!


<a href="https://discordbots.org/bot/612536352751353886" >
  <img src="https://discordbots.org/api/widget/612536352751353886.svg" alt="EmX" />
</a>
