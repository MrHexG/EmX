module.exports = {

	/**
	 * Instructions on how to get this: https://redd.it/40zgse
	 */
    yourID: "313676478984486912",

	setupCMD: "_createrolemessage",

	/**
	 * Delete the 'setupCMD' command after it is ran. Set to 'true' for the command message to be deleted
	 */
	deleteSetupCMD: true,

	initialMessage: `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`,
	
	embedMessage: `
	React to the emoji that matches the role you wish to receive.
	
	If you would like to remove the role, simply remove your reaction!
	`,
	
	/**
	 * Must set this if "embed" is set to true
	 */
	embedFooter: "Role Reactions",
	
	roles: ["Members", "DJ"],

	/**
	 * For custom emojis, provide the name of the emoji
	 */
    reactions: ["🕵🏼", "🎧"],

	/**
	 * Set to "true" if you want all roles to be in a single embed
	 */
	embed: true,

	/**
	 * Set the embed color if the "embed" variable is et to "true"
	 * Format:
	 * 
	 * #dd9323
	 */
    embedColor: "#800080",

	/**
	 * Set to "true" if you want to set a thumbnail in the embed
	 */
	embedThumbnail: true,

	/**
	 * The link for the embed thumbnail if "embedThumbnail" is set to true
	 */
    embedThumbnailLink: "https://i.ibb.co/gMS6gX4/mono.png",

	/**
	 * You"ll have to set this up yourself! Read more below:
	 * Please do not commit this token to the public if you contributed to this repository
	 * or host your code anywhere online. Giving someone your bot's token is the equivalent
	 * to giving someone the keys to your house and walking away!
	 * 
	 * https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
	 */
    botToken: client.login(process.env.token)
};
