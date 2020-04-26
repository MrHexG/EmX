<img align="right" src="https://i.ibb.co/gMS6gX4/mono.png" height="250" width="250">

# EmX [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![Support](https://img.shields.io/badge/support-Discord-blueviolet)](https://discord.io/SZYMusic)

EmX is an open source discord bot made by discord.js language. It's a language inside of Javascript & node. It lets users interact with the Discord API. I made this bot to have fun & to provide miscellanous commands.

## Commands
The following are some of the commands in this bot.
* _EmX - Simply describes the bot.
* _Invite - Gives you an invite link to bring the bot to your server.
* _Support - Gives you an invite link to the support server to answer your questions.
* _Tree - Plants a tree at will, only available every 12 hours. (Uses MongoDB)
* _Dog - Sends a randomly generated picture of a doggo!
* _Cat - Sends a randomly generated picture of a catto!
* _Hangman - Play hangman with many different types of topics!
* _covid <country> - Gives the latest stats of COVID-19 via this [COVID-19 API](https://github.com/backtrackbaba/covid-api)

## Invite EmX
To invite EmX to your server, just click this ---> [Invite](https://discordapp.com/oauth2/authorize?client_id=612536352751353886&permissions=523328&scope=bot)

## Hosting
If you're choosing to host the bot on your own, the instructions below will help you. If you'd like to contribute and help me add more commands and ideas, contact me via Email (spshewkani@gmail.com) or [Discord](https://discord.io/SZYMusic). You can also create an Issue in the Issue tab to give me an idea or command that you'd like to see in the future.

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
