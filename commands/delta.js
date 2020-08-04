const mongoose = require("mongoose");

const mongoPass = process.env.MONGODB_URI;

//Connect to DB
mongoose.connect(mongoPass,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const dLog = require("../models/log.js");
const Data = require("../models/data.js");

function arrMin(arr){
    return Math.min(...arr);
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

async function deltaLimit(donorid,userid){
    var output = [0,0];
    let dailycount=0;
    var diff_array=[];
    for await (const doc of dLog.find()) {
        
        if(donorid===doc.donorID){
            if(userid===doc.recID){
                //console.log(diff);
                var diff = (Date.now()-doc.time)
                if(diff<86400000){
                    diff_array.push(86400000-diff);
                    dailycount+=1;
                }
            }
        }
    }
    
    output[0]=dailycount;
    output[1]=round(arrMin(diff_array)/3600000,2);
    console.log(output[0]);
    return output;
}

module.exports.run = async (bot, message, args) => {
    if(!args[0]) {
        return message.reply("Please specify the user you wish to award a delta");
    } else {
        mentions = message.mentions.users;
        for (let value of mentions.values()) {
            var user = value;
            var donor = message.author;
            
            
            
            if(!user) {
                message.reply("Sorry couldn't find that user");
            }
            else if(user===donor) {
                message.reply("Nice try. You can't give yourself deltas.");
            }
            else if(user.bot) {
                message.reply("Can't award deltas to a bot");
            }
            else {
                var output = await deltaLimit(donor.id,user.id);
                if(output[0]>=2){
                    message.reply(`Daily limit of 2 deltas for this recipient reached. Award again in ${output[1]} hours.`);
                } else{
                    Data.findOne({
                        userID: user.id
                    },(err,data)=>{
                        if(err) console.log(err);
                        if(!data) {
                            const newData = new Data({
                                name: bot.users.cache.get(user.id).tag,
                                userID: user.id,
                                deltas: 1,
                                deltas_awarded:0,
                            })
                            newData.save().catch(err=>console.log(err));
                            
                        } else {
                            data.deltas+=1;
                            data.save().catch(err=>console.log(err));
                        }
                    })
    
                    Data.findOne({
                        userID: donor.id
                    },(err,data)=>{
                        if(err) console.log(err);
                        if(!data) {
                            const newData = new Data({
                                name: bot.users.cache.get(donor.id).tag,
                                userID: donor.id,
                                deltas: 0,
                                deltas_awarded:1,
                            })
                            newData.save().catch(err=>console.log(err));
                            
                        } else {
                            data.deltas_awarded+=1;
                            data.save().catch(err=>console.log(err));
                        }
                    })
                    const newLog = new dLog({
                        donorID:donor.id,
                        recID:user.id,
                        time: Date.now(),
                    })
                    newLog.save().catch(err=>console.log(err));
    
                    //Send message
                    message.channel.send(`Delta awarded successfully to ${bot.users.cache.get(user.id).username}`);
                }
                //Add delta received to recipient
                
                //Add to delta log
                /*let count = 0;
                for (x in deltalog) {
                    count+=1;
                }

                deltalog[count] = {
                    donor: donor.id,
                    recipient: user.id,
                    time: Date.now()
                }
                fs.writeFile("./deltalog.json", JSON.stringify(deltalog), (err) => {
                    if (err) console.log(err);
                })*/

                
            }
        }
        //var user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }

    
    
}

module.exports.help = {
    name: "delta",
    aliases: ["d"]
}