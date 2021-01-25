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
  name: "볼륨",
  aliases: ["vol", "volume"],
  description: "볼륨을 바꿉니다.",
  cooldown: 0.5,
  edesc: `Type the Command, to change the volume of the current song.\nUsage: ${PREFIX}볼륨 <0-200>`,

execute(message, args) {
    //if not a guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("769665713124016128");
    //get the current queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message,`재생중인 노래가 없습니다.`);
    //if not in the same voice channel as the Bot return
    if (!canModifyQueue(message.member)) return;
    //define Info Embed
    const volinfoembed = new MessageEmbed()
    .setColor("#00FFFD")
    .setTitle(`🔊 현재 볼륨: \`${queue.volume}%\``)
    //if no args return info embed
    if (!args[0]) return message.channel.send(volinfoembed).catch(console.error);
    //if args is not a number return error
    if (isNaN(args[0])) return attentionembed(message,"볼륨은 **0 에서 200** 까지 올리거나 줄일 수 있습니다.");
    //if args is not a Number between 150 and 0 return error
    if (parseInt(args[0]) < 0 || parseInt(args[0]) > 200)
      return attentionembed(message,"숫자가 더 높거나 낮습니다. 볼륨은 **0 에서 200** 까지 올리거나 줄일 수 있습니다.");
    //set queue volume to args
    queue.volume = args[0];
    //set current volume to the wanted volume
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    //define approve embed
    const volinfosetembed = new MessageEmbed()
    .setColor("#00FFFD")
    .setTitle(`🔊 바뀐 현재 볼륨: \`${args[0]}%\`!`)
    //Send approve message
    return queue.textChannel.send(volinfosetembed).catch(console.error);
  }
};
