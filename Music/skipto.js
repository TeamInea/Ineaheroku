////////////////////////////
////////CONFIG LOAD/////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "부분스킵",
  aliases: ["st", "jump"],
  description: "재생중인 노래의 부분을 스킵합니다.",
  cooldown: 0.5,
  edesc: `Type the Command, to skip a specific amount of songs to the wanted song.\nUsage: ${PREFIX}부분스킵 [재생목록 번호]`,

execute(message, args) {
    //if not in a guild return
    if (!message.guild) return;
    //react with approve
    message.react("769665713124016128").catch(console.error);
    //if no args return error
    if (!args.length)
      return attentionembed(message, `Try: ${message.client.prefix}${module.exports.name} [재생목록 번호]`)
    //if not a number return error
    if (isNaN(args[0]))
      return attentionembed(message, `Try: ${message.client.prefix}${module.exports.name} [재생목록 번호]`)
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if no Queue return error
    if (!queue) return attentionembed(message, "재생목록이 없습니다.");
    //if member not in the same voice channel as the Bot return
    if (!canModifyQueue(message.member)) return;
    //if args bigger then the Server Queue return error
    if (args[0] > queue.songs.length)
      return attentionembed(message, `재생목록에는 **${queue.songs.length}** 이하의 노래가 포함되있습니다.`);
    //set playing to true
    queue.playing = true;
    //if the queue is loop
    if (queue.loop) {
      //make a loop for all songs to skip and add them at the end again
      for (let i = 0; i < args[0] - 1; i++)
        queue.songs.push(queue.songs.shift());
    //if not a loop
    } else {
      //remove all songs including the args
      queue.songs = queue.songs.slice(args[0] - 1);
    }
    //end current song
    queue.connection.dispatcher.end();
    //Send approve
    queue.textChannel.send(
      new MessageEmbed()
        .setColor("#00FFFD")
        .setAuthor(`${message.author.username}#${message.author.discriminator}님께서 부분스킵을 **${args[0]}** 만큼 스킵 하셨습니다.`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
    ).catch(console.error);
  }
};
