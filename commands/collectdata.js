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
    
    
    
    for await (const doc of selog.find()) {
        console.log(doc.finished);
        if(!doc.finished&&doc.server===message.channel.guild.name&&doc.channel===message.channel.name){
            
            if(message.author.id===doc.SE_ID){
                
                doc.SE_consent=true;
                doc.save().catch(err=>console.log(err));
                if(doc.IL_consent){
                    message.channel.send(`Thank you both, data collection for machine learning in this channel has started, and will end when the epistemologist types:\n> d!finishse @Interlocutor`);
                } else{
                    message.channel.send("Thank you Epistemologist for your consent. Data collection will take place if the Interlocutor also consents.")
                }
            } else if(message.author.id===doc.IL_ID){
                doc.IL_consent=true;
                doc.save().catch(err=>console.log(err));
                if(doc.SE_consent){
                    message.channel.send(`Thank you both, data collection for machine learning in this channel has started, and will end when the epistemologist types:\n> d!finishse @Interlocutor`);
                } else{
                    message.channel.send("Thank you Interlocutor for your consent. Data collection will take place if the Epistemologist also consents.")
                }
            }
        }
        
        /*if(message.author.id===doc.SE_ID){
            if(IL.id===doc.IL_ID){
                if(!doc.finished){
                    
                    doc.recording=true;
                    startedAnSEWithThisPerson=true;
                    
                    doc.save().catch(err=>console.log(err));
                    message.channel.send(`Thank you, we really appreciate it!`);
                    //return true;
                } 
            }
        }*/
    }
    /*if(!startedAnSEWithThisPerson) {
        message.channel.send(`You didn't start an SE with this person`);
    }*/
        
    
}

module.exports.help = {
    name: "collectdata",
    aliases: []
}