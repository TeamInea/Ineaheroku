////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "반복",
  aliases: ['loop', 'l'],
  description: "음악을 무한 반복합니다.",
  cooldown: 0.5,
  edesc: `Just type the Command in the chat to activate/deactivate loop, you can also react to the loop emoji, to receive the same goal!\nUsage: ${PREFIX}반복`,
async execute(message) {
    //if not in a Guild return
    if(!message.guild) return;
    //Get the current Queue
    const queue = message.client.queue.get(message.guild.id);
    //If no Queue Error
    if (!queue) return attentionembed(message, "아무것도 재생중이지 않습니다.").catch(console.error);
    //If not in a VOICE
    if (!await canModifyQueue(message.member)) return;
    //Reverse the Loop state
    queue.loop = !queue.loop;
    //Define the Loop embed
    const loopembed = new MessageEmbed()
    .setColor(queue.loop ? "#00FFFD" : "#00FFFD")
    .setAuthor(`반복을 시작합니다. ${queue.loop ? " 활성화됨" : " 비활성화됨"}`, "https://cdn.discordapp.com/emojis/769913064194834511.png")
    //react with approve emoji
    message.react("769665713124016128");
    //send message into the Queue chat
    return queue.textChannel
      .send(loopembed)
      .catch(console.error);
  }
};
