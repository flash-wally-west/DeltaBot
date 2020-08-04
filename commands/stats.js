const Discord = require('discord.js');
const mongoose = require("mongoose");
const mongoPass = process.env.MONGODB_URI;
//Connect to DB
mongoose.connect(mongoPass,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Data = require("../models/data.js");

function numToEmoji(num) {
    var outStr = "";
    var emoji = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];
    var numString = num.toString();
    var chars = numString.split('');
    for (var i = 0; i < chars.length; i++) {
        var emoj = parseInt(chars[i]);
        outStr = outStr + emoji[emoj];
      }
      return outStr;
}

function makeStatEmbed(name,has,awarded){
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`${name}'s delta stats`)
      // Set the color of the embed
      .setColor(0xff0000)
      // Set the main content of the embed
      .addField('Has',has)
      .addField('Awarded to others', awarded)
    return embed;
}

module.exports.run = async (bot, message, args) => {
    var user;
    if(!args[0]) {
        user = message.author;
    } else {
        user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }
    Data.findOne({
        userID: user.id
    },(err,data)=>{
        if(err) console.log(err);
        if(!data) {
            const newData = new Data({
                name: bot.users.cache.get(user.id).tag,
                userID: user.id,
                deltas: 0,
                deltas_awarded:0,
            })
            newData.save().catch(err=>console.log(err));
            const embed = makeStatEmbed(bot.users.cache.get(user.id).username,numToEmoji(0),numToEmoji(0));
            // Send the embed
            return message.channel.send(embed);
        } else {

            const embed = makeStatEmbed(bot.users.cache.get(user.id).username,numToEmoji(data.deltas),numToEmoji(data.deltas_awarded));
            // Send the embed
            return message.channel.send(embed);
        }
    })
    /*if(!deltas[user.id]) {
        deltas[user.id] = {
            name: bot.users.cache.get(user.id).tag,
            deltas_g: 0,
            deltas_r: 0
        }
        fs.writeFile("./deltas.json", JSON.stringify(deltas), (err) => {
            if (err) console.log(err);
        })
    }*/
    
    //return message.channel.send(`${bot.users.cache.get(user.id).username} has ${deltas[user.id].deltas_r} deltas, and has awarded ${deltas[user.id].deltas_g} deltas to others`);
    
    //return message.channel.send(`${bot.users.cache.get(user.id).username} has ` + has + " deltas, and has awarded "+ awarded+ " deltas to others");
}

module.exports.help = {
    name: "statistics",
    aliases: ["stats","stat"]
}

