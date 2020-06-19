module.exports.run = async (bot, message, args) => {
    let MyMember = message.guild.roles.cache.get('598880700074033212');
    let MyDJ = message.guild.roles.cache.get('598881045768699914');
    const member = message.mentions.members.first();

    member.roles.add(MyMember);
    member.roles.add(MyDJ)
    message.channel.send('Role Added')
}

module.exports.config = {
    name: "addrole",
    description: "Adds the role for a particular new member",
    usage: "_addrole",
    accessableby: "Members",
    aliases: ['addroles']
}