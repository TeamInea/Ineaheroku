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
  name: "바꾸기",
  aliases: ["mix"],
  description: "대기열의 노래 순서를 바꿉니다.",
  cooldown: 0.5,
  edesc: `Type the Command, if a Queue exists to change to Order of the Queue, randomly.\nUsage: ${PREFIX}바꾸기`,

execute(message,args,client) {
    //if not in a guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //get the Queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message, "대기열이 없습니다.");
    //if not in the same channel as the bot
    if (!canModifyQueue(message.member)) return;
    //get all queue songs
    let songs = queue.songs;
    //make an array and mix them
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    //define queue.songs
    queue.songs = songs;
    //set the Queue
    message.client.queue.set(message.guild.id, queue);
    //send the Approve message
    queue.textChannel.send(new MessageEmbed()
    .setDescription(`**✅ | ${message.author} 대기열 순서를 바꿨습니다.**`)
    .setColor("#00FFFD")).catch(console.error);
  }
};
