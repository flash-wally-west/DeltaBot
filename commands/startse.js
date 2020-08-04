const mongoose = require("mongoose");
const mongoPass = process.env.MONGODB_URI;
//Connect to DB
mongoose.connect(mongoPass,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const selog = require("../models/selog.js");

module.exports.run = async (bot, message, args) => {
    if(!args[0]) {
        return message.reply("Please specify the IL that you will SE");
    } else {
        if(message.author.id===message.mentions.users.first().id) {
            message.reply("You can't do SE with yourself");
        } else if(message.mentions.users.first().bot) {
            message.reply("Can't do SE with a bot");
        } else {
            
        const newSELog = new selog({
            SE_ID:message.author.id,
            IL_ID:message.mentions.users.first().id,
            claim:"",
            server:message.channel.guild.name,
            channel:message.channel.name,
            finished:false,
            SE_consent:false,
            IL_consent:false,
        })
        newSELog.save().catch(err=>console.log(err));
        message.channel.send(`${message.author} is doing SE with ${message.mentions.users.first()}`);
        message.channel.send("It would be greatly appreciated if you and your interlocutor are okay with letting your text messages be *anonymously* collected for machine learning purposes. If yes, please type:\n> d!collectdata")
        }
    }
}

module.exports.help = {
    name: "start-SE",
    aliases: ["se","startse","start-se","startSE"]
}