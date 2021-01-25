////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const ytsr = require("youtube-sr")
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "검색",
  description: "노래를 검색합니다.",
  aliases: ["find", "Search"],
  cooldown: 0.5,
  edesc: `Type this Command to find first 5 results for your song!\nUsage: ${PREFIX}검색 <TITEL | URL>`,

async execute(message,args,client) {
    //if its not in a guild return
    if(!message.guild) return;
     //define channel
     const { channel } = message.member.voice;
     //get serverqueue
     const serverQueue = message.client.queue.get(message.guild.id);
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //if the argslength is null return error
    if (!args.length)
      return attentionembed(message,`사용방법: ${message.client.prefix}${module.exports.name} <Video Name>`)
    //if there is already a search return error
    if (message.channel.activeCollector)
      return attentionembed(message,"검색이 활성화되었습니다!");
    //if the user is not in a voice channel return error
    if (!message.member.voice.channel)
      return attentionembed(message,"먼저 음성채널에 있어야 합니다.")
       //If not in the same channel return error
    if (serverQueue && channel !== message.guild.me.voice.channel)
    return attentionembed(message, `이네아 봇과 같은 채널에 있어야 합니다.`);
    //define search
    const search = args.join(" ");
    //define a temporary Loading Embed
    let temEmbed = new MessageEmbed()
    .setAuthor("검색중...", "https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1")
    .setColor("#00FFFD")
    //define the Result Embed
    let resultsEmbed = new MessageEmbed()
      .setTitle("<:Playing:769665713124016128> Results for: ")
      .setDescription(`\`${search}\``)
      .setColor("#00FFFD")
      .setFooter("즐겨찾는 번호로 응답합니다.", client.user.displayAvatarURL() )
    //try to find top 5 results
    try {
      //find them
      const results = await ytsr.search(search, { limit: 5 });
      //map them and sort them and add a Field to the ResultEmbed
      results.map((video, index) => resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`));
      // send the temporary embed
      const resultsMessage = await message.channel.send(temEmbed)
      //react with 5 Numbers
        await resultsMessage.react("769932441967263754");
        await resultsMessage.react("769932441909067786");
        await resultsMessage.react("769932441946816542");
        await resultsMessage.react("769932569235292170");
        await resultsMessage.react("769933892014440448");
      //edit the resultmessage to the resultembed
        await resultsMessage.edit(resultsEmbed)
      //set the collector to true
      message.channel.activeCollector = true;
      //wait for a response
      let response;
      await resultsMessage.awaitReactions((reaction, user) => user.id == message.author.id,
      {max: 1, time: 60000, errors: ['time'],} ).then(collected => {
        //if its one of the emoji set them to 1 / 2 / 3 / 4 / 5
          if(collected.first().emoji.id == "769932441967263754"){ return response = 1; }
          if(collected.first().emoji.id == "769932441909067786"){ return response = 2; }
          if(collected.first().emoji.id == "769932441946816542"){ return response = 3; }
          if(collected.first().emoji.id == "769932569235292170"){ return response = 4; }
          if(collected.first().emoji.id == "769933892014440448"){ return response = 5; }
          //otherwise set it to error
          else{
            response = "error";
          }
        });
        //if response is error return error
      if(response === "error"){
        //send error message
        attentionembed(message,"Please use a right emoji!");
        //try to delete the message
        return resultsMessage.delete().catch(console.error);
      }
      //get the field name of the response
      const choice = resultsEmbed.fields[parseInt(response) - 1].name;
      //set collector to false aka off
      message.channel.activeCollector = false;
      //play the collected song
      message.client.commands.get("play").execute(message, [choice]);
      //delete the search embed
      resultsMessage.delete().catch(console.error);
      //catch any errors while searching
    } catch (error) {
      //log them
      console.error(error);
      //set collector false, just incase its still true
      message.channel.activeCollector = false;
    }
  }
};
