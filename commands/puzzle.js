const mongoose = require("mongoose");
const mongoPass = process.env.MONGODB_URI;
//Connect to DB
mongoose.connect(mongoPass,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Pieces = require("../models/pieces.js");

module.exports.run = async (bot, message, args) => {
    Pieces.findOne({
        userID: message.author.id
    },(err,data)=>{
        if(err) console.log(err);
        if(!data) {
            const newData = new Pieces({
                userID: message.author.id,
                pieces: 0,
            })
            newData.save().catch(err=>console.log(err));
            message.reply("You have no puzzle pieces");
        } else {
            if(data.pieces===0) {
                message.reply("You have no puzzle pieces");
            } else if(data.pieces===1){
                //message.channel.send()
                message.channel.send("You have 1 piece", {files: ["./pictures/1piece.jpg"]});
            } else if(data.pieces===2){
                message.channel.send("You have 2 pieces", {files: ["./pictures/2pieces.jpg"]});
            } else if(data.pieces===3){
                message.channel.send("You have all 3 pieces", {files: ["./pictures/3pieces.jpg"]});
            } else if(data.pieces===4){
                message.channel.send("You have all 3 pieces", {files: ["./pictures/3pieces.jpg"]});
                message.channel.send("Whoa! You now also have 1 piece of a BRAND NEW puzzle", {files: ["./pictures/1cat.png"]});
            } else if(data.pieces===5){
                message.channel.send("You have 2 pieces of your 2nd puzzle\nWhoa its a cat! Maybe there are more...", {files: ["./pictures/2cat.png"]});
            } else if(data.pieces===6){
                message.channel.send("You have 3 pieces of your 2nd puzzle", {files: ["./pictures/3cat.jpg"]});
            } else if(data.pieces===7){
                message.channel.send("You have 4 pieces of your 2nd puzzle", {files: ["./pictures/4cat.jpg"]});
            } else if(data.pieces===8){
                message.channel.send("You have 5 pieces of your 2nd puzzle", {files: ["./pictures/5cat.jpg"]});
            } else if(data.pieces===9){
                message.channel.send("You have all 6 pieces of your 2nd puzzle", {files: ["./pictures/6cat.jpg"]});
            }
        }
    })
}

module.exports.help = {
    name: "puzzle",
    aliases: []
}