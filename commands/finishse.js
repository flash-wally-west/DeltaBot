const mongoose = require("mongoose");
const mongoPass = process.env.MONGODB_URI;
//Connect to DB
mongoose.connect(mongoPass,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const selog = require("../models/selog.js");
const Pieces = require("../models/pieces.js");

module.exports.run = async (bot, message, args) => {
    if(!args[0]) {
        return message.reply("Please specify the IL");
    } else {
        var SE = message.author;
        var IL = message.mentions.users.first();
        var startedAnSEWithThisPerson = false;
        for await (const doc of selog.find()) {
            
            if(SE.id===doc.SE_ID){
                if(IL.id===doc.IL_ID){
                    if(!doc.finished&&doc.server===message.channel.guild.name&&doc.channel===message.channel.name){
                        
                        Pieces.findOne({
                            userID: IL.id
                        },(err,data)=>{
                            if(err) console.log(err);
                            if(!data) {
                                const newData = new Pieces({
                                    userID: IL.id,
                                    pieces: 1,
                                })
                                newData.save().catch(err=>console.log(err));
                                
                            } else {
                                data.pieces+=1;
                                data.save().catch(err=>console.log(err));
                            }
                        })
                        startedAnSEWithThisPerson=true;
                        doc.finished=true;
                        doc.save().catch(err=>console.log(err));
                        message.channel.send(`Puzzle piece gifted to ${IL.username}`);
                        //return true;
                    } 
                }
            }
        }
        if(!startedAnSEWithThisPerson) {
            message.channel.send(`You didn't start an SE with this person`);
        }
        
    }
    
    //return false;
}

module.exports.help = {
    name: "finish-SE",
    aliases: ["finish","finishse","finish-se","finishSE"]
}