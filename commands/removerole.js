module.exports.run = async (bot, message, args) => {
    let MyMember = message.guild.roles.cache.get('598880700074033212');
    let MyDJ = message.guild.roles.cache.get('598881045768699914');
    const member = message.mentions.members.first();

    member.roles.remove(MyMember);
    member.roles.remove(MyDJ)
    message.channel.send('Role Removed')
}

module.exports.config = {
    name: "removerole",
    description: "Removes the default roles from the tagged user",
    usage: "_removerole",
    accessableby: "Members",
    aliases: []
}