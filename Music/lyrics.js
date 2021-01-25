////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "가사",
  aliases: ["ly", "text", "lyrics"],
  description: "노래 가사를 보여줍니다.",
  cooldown: 0.5,
  edesc: `Type the Command while listening to a song, to get the lyrics from!\nUsage: ${PREFIX}가사`,

async execute(message) {
    //if not in a Guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //Get the current Queue
    const queue = message.client.queue.get(message.guild.id);
    //If no Queue Error
    if (!queue) return attentionembed(message, "지금 재생중인 노래가 없습니다.");
    //If not in a VOICE
    if (!canModifyQueue(message.member)) return;
    //Set lyrics to null for the try catch
    let lyrics = null;
    //define the temporary Embed
    let temEmbed = new MessageEmbed()
    .setAuthor("검색중...", "https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1").setFooter("**가사 찾는 중** 기다려주세요!")
    .setColor("#00FFFD")
    //send it and safe it in a variable
    let result = await message.channel.send(temEmbed)
    //try to find lyrics
    try {
      //use lyricsfinder
      lyrics = await lyricsFinder(queue.songs[0].title,"");
      //If no Lyrics define no lyrics
      if (!lyrics) lyrics = `가사 없습니다. ${queue.songs[0].title}.`;
    }
    //catch any error
    catch (error) {
      lyrics = `가사 없습니다. ${queue.songs[0].title}.`;
    }
    //define lyrics Embed
    let lyricsEmbed = new MessageEmbed()
      .setTitle(`**${queue.songs[0].title}**`)
      .setDescription(lyrics)
      .setColor("#00FFFD")
    //if to long make slice it
    if (lyricsEmbed.description.length >= 2048)
      //slice the embed description and redefine it
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      //edit to approve
    return result.edit(lyricsEmbed).catch(console.error);
  }
};
