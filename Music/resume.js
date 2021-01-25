////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "재개",
  aliases: ["resume", "시작", "다시시작"],
  description: "일시중지 했던 노래를 다시 재생합니다.",
  cooldown: 0.5,
  edesc: `Type this command to resume the paused Song!\nUsage: ${PREFIX}재개`,

execute(message) {
    //if not a guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //get the Server Queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message,"지금 재생중인 노래가 없습니다.").catch(console.error);
    //if user not in the same channel as the bot retunr
    if (!canModifyQueue(message.member)) return;
    //if its paused
    if (!queue.playing) {
      //set it to true
      queue.playing = true;
      //resume the Bot
      queue.connection.dispatcher.resume();
      //Create approve embed
      const playembed = new MessageEmbed().setColor("#00FFFD")
      .setAuthor(`${message.author.username} 님께서 노래를 다시 재생했습니다.`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      //send the approve
      return queue.textChannel.send(playembed).catch(console.error);
    }
    //if its not paused return error
    return  attentionembed(message, "The Queue is not paused!").catch(console.error);
  }
};
