const Discord = require('discord.js');

function makeDeltaEmbed(){
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`Delta Commands`)
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .setDescription("To award a delta use the delta command followed by the user(s) who is/are receiving it. \n> d!delta @user1 @user2\n\nTo see someone's stats, use the stats command and mention the user in question. If no user is mentioned, your own stats will be given.\n> d!stats @user\nor\n> d!stats")
      .setFooter("To report a bug message @flash#4171")
    return embed;
}

function makeBasicHelpEmbed(){
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`Main Menu`)
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .setDescription("To see the SE features, type:\n\n> d!help se\n\nTo see the Delta features, type:\n\n> d!help delta")
      .setFooter("To report a bug message @flash#4171")
    return embed;
}

function makeSEEmbed(){
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`Street Epistemology Commands`)
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .setDescription("To set a timer, type:\n> d!timer [time in minutes]\n\nTo see your puzzle pieces, type:\n> d!puzzle\n\nAn epistemologist/interrogator can use the following SE commands.\nTo start an SE session, type:\n> d!startse @Interlocuter\n\nTo finish the SE session the epistemologist/interrogater must type:\n> d!finishse @Interlocutor")
      .setFooter("To report a bug message @flash#4171")
    return embed;
}

module.exports.run = async (bot, message, args) => {
    if(args[0]==="se"){
        return message.channel.send(makeSEEmbed());
    } else if(args[0]==="delta"){
        return message.channel.send(makeDeltaEmbed());
    } else {
        return message.channel.send(makeBasicHelpEmbed());
    }
    
}

module.exports.help = {
    name: "help",
    aliases: ["h"]
}