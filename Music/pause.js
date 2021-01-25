const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");

const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
module.exports = {
  name: "일시정지",
  aliases: ["pause", "일시정지"],
  description: "음악을 일시정지 합니다.",
  cooldown: 0.5,
  edesc: `Type this command to pause the Song!\nUsage: ${PREFIX}일시정지`,
  execute(message) {
    //If not in a guild return
    if(!message.guild) return;
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message, "지금 재생중인 노래가 없습니다.").catch(console.error);
    //If not in the same channel return
    if (!canModifyQueue(message.member)) return;
    //If its playing
    if (queue.playing) {
      //set playing to false
      queue.playing = false;
      //pause the music
      queue.connection.dispatcher.pause(true);
      //define the pause embed
      const pausemebed = new MessageEmbed().setColor("#00FFFD")
      .setAuthor(`${message.author.username} 음악을 일시정지 시켰습니다.`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      //react with approve emoji
      message.react("769665713124016128")
      //return message
      return queue.textChannel.send(pausemebed).catch(console.error);
    }
  }
};
