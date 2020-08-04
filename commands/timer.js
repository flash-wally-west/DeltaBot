const Discord = require('discord.js');

function update(time,message){
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`Timer`)
      // Set the color of the embed
      .setColor(0x3399ff)
      // Set the main content of the embed
      .setDescription(fancyTimeFormat(time))
    
    return message.edit(embed);
}

function alarm(message){
    return message.reply("Timer is up");
}

function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

module.exports.run = async (bot, message, args) => {
    if(!args[0]){
        return message.reply("Please specify the amount of time (in minutes) you want to set a timer for");
    } else{
        var time = args[0];
        const embed = new Discord.MessageEmbed()
            // Set the title of the field
            .setTitle(`Timer`)
            // Set the color of the embed
            .setColor(0x3399ff)
            // Set the main content of the embed
            .setDescription(fancyTimeFormat(time*60))
    
        const m = await message.channel.send(embed);
        var timeLeft = (time*60)-5;
        while(timeLeft>=0){
            setTimeout(update,((time*60)-timeLeft)*1000,timeLeft,m);
            timeLeft = timeLeft-5;
        }

        setTimeout(alarm,time*60000,message);

        
        /*for (let i = 0; i < (time*6); i++) {
            const timeLeft = (time*60)-((i+1)*10);
            console.log(timeLeft);
            const embed = new Discord.MessageEmbed()
                // Set the title of the field
                .setTitle(`Timer`)
                // Set the color of the embed
                .setColor(0x3399ff)
                // Set the main content of the embed
                .setDescription(`Your timer has ${timeLeft} minutes remaining`)
            setTimeout(m.edit,10000,`Your timer has ${timeLeft} seconds remaining`);
        }*/
        

        //setTimeout(countdown, args[0]*60000, args[0],message.channel);
        return;
    }
    
}

module.exports.help = {
    name: "timer",
    aliases: []
}