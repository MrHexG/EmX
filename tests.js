const CONFIG = require('./config.example');

if (CONFIG.botToken !== '') 
	throw new Error("Please remove the Discord bot token from 'botToken' in the config.js file.");
if (CONFIG.yourID !== '')
	throw new Error("Please remove the user ID from 'yourID' in the config.js file.");
