const mongoose = require('mongoose');
const botsettings = require('../data/botsettings.js');

//init code
mongoose.connect(botsettings.mongodb , { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('DB connected!')
});

//DB setup
// var treeSchema = new mongoose.Schema({
//     user_id: String,
//     planted_time: Date
// });
// treeSchema.methods.getPlantedTime = function () {
//     return this.planted_time;
// }
// var Tree = mongoose.model('Tree', treeSchema);

var guildSettings = new mongoose.Schema({
    guild_id: String,
    prefix: String,
    disabled: Array
});
var GuildSettings = mongoose.model('GuildSettings', guildSettings);

async function guildCreate(guild) {
    console.log('guild create triggered');
    const g = await GuildSettings.findOne({ guild_id: guild.id });
    if (g == null) {
        var new_guild = new GuildSettings({
            guild_id: guild.id,
            prefix: '-',
            disabled: []
        });
        new_guild.save(function (err, new_guild) {
            console.log('guild added to DB');
        })
    }
}
module.exports.guildCreate = guildCreate;
async function guildDelete(guild) {
    console.log('guild delete triggered');
    await GuildSettings.findOneAndRemove({ guild_id: guild.id });
}
module.exports.guildDelete = guildDelete;
async function guildRetrieve(guild) {
    return await GuildSettings.findOne({ guild_id: guild.id });
}
module.exports.guildRetrieve = guildRetrieve;
