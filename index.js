const Discord = require('discord.js');
const {Client,Intents} = require('discord.js');
const bot = new Discord.Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS],partials:['MESSAGE','CHANNEL','REACTION']});
const fs = require("fs");

bot.commands= new Discord.Collection();
bot.aliases= new Discord.Collection();
const selog = require("./models/selog.js");

const mongoose = require("mongoose");
const mongoPass = process.env.MONGODB_URI;
//Connect to DB
mongoose.connect(mongoPass,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//READ COMMANDS FOLDER
fs.readdir("./commands/", (err, files) => {
     if(err) console.log(err);

     let jsfile = files.filter(f =>f.split(".").pop()==="js")
     if(jsfile.length <= 0 ) {
         console.log("Could not find any commands");
         return;
     }

     jsfile.forEach((f) => {
         let props = require(`./commands/${f}`);
         console.log(`${f} loaded!`)
         bot.commands.set(props.help.name, props);

         props.help.aliases.forEach(alias => {
             bot.aliases.set(alias, props.help.name);
         })
     })

     
})

// BOT ONLINE MESSAGE
bot.on('ready', async() => {
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);
    bot.user.setActivity(`with ${bot.guilds.cache.size} servers | d!help`);
})

bot.on('message', async message =>{
    //CHECK CHANNEL AND AUTHOR
    if(message.channel.type==='dm') return;
    if (message.author.bot) {
        
        //message.reply(`Bot ID: ${message.author.id}`);
        message.reactions.removeAll()
        message.channel.messages.fetch().map(r => r).then(message => {
            message.reactions.forEach(reaction => reaction.remove("235148962103951360"))
        })
        //message.reply("checkpoint, reactions supposedly removed")
        
        
    };

    //SET PREFIX
    let prefix = "d!";
    
    //CHECK PREFIX
    if(!message.content.startsWith(prefix)) {
        //code for storing SE convo here
        var author = message.author;
        for await (const doc of selog.find()) {
            if(!doc.finished&&doc.SE_consent&&doc.IL_consent){
                console.log("There exists an unfinished SE");
                if(doc.server===message.channel.guild.name){
                    console.log("This unfinished SE was started in this server");
                    if(doc.channel===message.channel.name){
                        console.log("This unfinished SE was started in this channel");
                        if(author.id===doc.SE_ID){
                    
                            
                            
                            doc.convodata.push({from:"Epistemologist", text:message.content,ts:message.createdTimestamp});
                            
                            
                            doc.save().catch(err=>console.log(err));
                        } else if(author.id===doc.IL_ID){
                            
                            
                            doc.convodata.push({from:"Interlocutor", text:message.content,ts:message.createdTimestamp});
                            
                            
                            doc.save().catch(err=>console.log(err));
                        }
                    }
                }
                
                //doc.save().catch(err=>console.log(err));
            }
            
            
        }
        return;
    };

    //DEFINE ARGS AND COMMANDS
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLowerCase();
    let command;
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args)

    //RUN COMMANDS
    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)){
        command = bot.commands.get(bot.aliases.get(cmd));
    }
    try {
        command.run(bot, message, args);
    } catch(e){
        return;
    }

    if(message.content == 'Hi'){
        message.reply("Hello World!");
    }
})

bot.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
    }
    if(reaction.message.channel.name==='suggestion-box'){
        reaction.message.reactions.removeAll()
    }
    
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

bot.login(process.env.BOT_TOKEN);
