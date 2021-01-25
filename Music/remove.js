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
  name: "삭제",
  description: "대기열에 노래를 제거 합니다.",
  aliases: ["delete", "remove"],
  cooldown: 0.5,
  edesc: `Type this command to remove a specific song from the queue.\nUsage: ${PREFIX}삭제 <재생목록 번호>`,

execute(message, args) {
  //if its not a guild return
    if(!message.guild) return;
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if there is no queue return error
    if (!queue) return attentionembed(message,"재생목록이 없습니다.");
    //if he isnt in the same voice channel as the bot
    if (!canModifyQueue(message.member)) return;
    //if no args then return error
    if (!args.length) return attentionembed(message,`${message.client.prefix}삭제 <재생목록 번호>`);
    //If not a number then return error
    if (isNaN(args[0])) return attentionembed(message,`${message.client.prefix}삭제 <재생목록 번호>`);
    //get the song
    const song = queue.songs.splice(args[0], 1);
    //react with approve
    message.react("797482974970118184")
    //send approve
    queue.textChannel.send(new MessageEmbed()
    .setDescription(`<:XX:797482974970118184> | ${message.author} 제거함 **${song[0].title}** 대기열`)
    .setColor("#00FFFD")
    );
  }
};
