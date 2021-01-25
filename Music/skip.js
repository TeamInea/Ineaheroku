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
  name: "스킵",
  aliases: ["skip"],
  description: "노래를 전체 스킵합니다.",
  cooldown: 0.5,
  edesc: `Type the Command, to skip to current listening song.\nUsage: ${PREFIX}스킵`,

execute(message) {
    //if not in a guild retunr
    if (!message.guild) return;
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if no Queue return error
    if (!queue)
      return attentionembed(message, "스킵할 노래가 없습니다.!").catch(console.error);
    //if not in the same channel return
    if (!canModifyQueue(message.member)) return;
    //set playing to true
    queue.playing = true;
    //end current song
    queue.connection.dispatcher.end();
    //send approve message
    queue.textChannel.send(
      new MessageEmbed().setColor("#00FFFD").setAuthor(`${message.author.username} 님께서 노래를 스킵하셨습니다.`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
    ).catch(console.error);
  }
};
