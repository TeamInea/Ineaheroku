////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const { Client, Collection } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "재생목록",
  aliases: ["queue", "대기열", "목록"],
  description: "현재 음악의 재생목록을 보여줍니다.",
  cooldown: 0.5,
  edesc: `Type this command to play some music.\nUsage: ${PREFIX}재생목록`,
  execute(message) {
    //if not in a guild return
    if(!message.guild) return;
    //get serverqueue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue aka nothing playing error
    if (!queue) return attentionembed(message, "아무것도 재생중이지 않습니다.").catch(console.error);
    //set description
    console.log(queue.songs);
    let description = "";
    for(let i = 0; i < queue.songs.length; i++){
      description += `**${i}.** [${queue.songs[i].title.substring(0,100)}](${queue.songs[i].url}) | \`${queue.songs[i].duration}\`\n`
    }
    //define queueembed
    let queueEmbed = new MessageEmbed()
      .setTitle("**[ 음악 재생목록 ]**")
      .setDescription(description)
      .setColor("#00FFFD");
    //split the description
    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });
    //For every description send a new embed
    splitDescription.forEach(async (m) => {
      //(over)write embed description
      queueEmbed.setDescription(m);
      //react with emoji
      message.react("769665713124016128")
      //send embed
      message.channel.send(queueEmbed);
    });
  }
};
