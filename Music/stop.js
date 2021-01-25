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
  name: "종료",
  description: "재생중인 노래를 중지시킵니다.",
  aliases: ["leave", "end", "stop", "나가기", "중지"],
  cooldown: 0.5,
  edesc: `Type the Command, to stop playing and leave the channel.\nUsage: ${PREFIX}중지`,

async execute(message,args,client) {
  //if not in a guild retunr
  if (!message.guild) return;
  //react with approve emoji
  message.react("769665713124016128").catch(console.error);
  const { channel } = message.member.voice;
  //get the serverQueue
  const queue = message.client.queue.get(message.guild.id);
  //if not a valid channel
  if (!channel) return attentionembed(message, "먼저 음성채널에 있어야 합니다.");
  //If not in the same channel return error
  if (queue && channel !== message.guild.me.voice.channel)
  return attentionembed(message, `이네아 봇과 같은 채널에 있어야 합니다.`);
  //if no Queue return error
  if (!queue)
    return attentionembed(message, "재생중인 노래가 없어 중지할 수 없습니다.");
  //if not in the same channel return
  if (!canModifyQueue(message.member)) return;
  //Leave the channel
  await channel.leave();
  //send the approve message
  message.channel.send(new MessageEmbed()
  .setColor("#00FFFD")
  .setAuthor(`${message.author.username} 님께서 노래를 중지 시켰습니다!`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png"))
  .catch(console.error);
  }
};
