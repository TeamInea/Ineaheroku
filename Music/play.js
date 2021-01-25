////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { play } = require("../include/play");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
const ytsr = require("youtube-sr")

////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "플레이",
  aliases: ["play", "p", "재생"],
  description: "노래를 재생합니다 (Youtube/스트리밍)",
  cooldown: 0.5,
  edesc: `Type this command to play some music.\nUsage: ${PREFIX}플레이 <TITLE | URL>`,

async execute(message, args, client) {
    //If not in a guild return
    if (!message.guild) return;
    //define channel
    const { channel } = message.member.voice;
    //get serverqueue
    const serverQueue = message.client.queue.get(message.guild.id);
    //If not in a channel return error
    if (!channel) return attentionembed(message, "음성채널에 있어야 합니다!");
    //If not in the same channel return error
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return attentionembed(message, `이네아 봇과 같은 채널에 있지 않습니다.`);
    //If no args return
    if (!args.length)
      return attentionembed(message, `사용방법: ${message.client.prefix}플레이 <YouTube URL | Video Name | Soundcloud URL>`);
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //get permissions and send error if bot doesnt have enough
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return attentionembed(message, "음성 채널 권한이 필요합니다. **CONNECT**!");
    if (!permissions.has("SPEAK"))
      return attentionembed(message, "음성 채널 권한이 필요합니다. **SPEAK**");

    //define some url patterns
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const urlValid = videoPattern.test(args[0]);

    //define Queue Construct
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 69,
      filters: [],
      realseek: 0,
      playing: true
    };
    //get song infos to null
    let songInfo = null;
    let song = null;
    //try catch for errors
    try {
      //If something is playing
      if (serverQueue) {
        //if its an url
        if (urlValid) { //send searching link
          message.channel.send(new MessageEmbed().setColor("#00FFFD")
            .setDescription(`**유튜브 검색중 🔍 [\`LINK\`](${args.join(" ")})**`))
        //if not
        }
        else { //send searching TITLE
          message.channel.send(new MessageEmbed().setColor("#00FFFD")
            .setDescription(`**유튜브 검색중 🔍 \`${args.join(" ")}\`**`))
        }
      } else {
        //If nothing is playing join the channel
        queueConstruct.connection = await channel.join();
        //send join message
        message.channel.send(new MessageEmbed().setColor("#00FFFD")
          .setDescription(`**👍 참가한 음성채널 \`${channel.name}\` 요청한 채널: \`#${message.channel.name}\`**`)
          .setFooter(`By: ${message.author.username}#${message.author.discriminator}`))
        //if its an url
        if (urlValid) { //send searching link
          message.channel.send(new MessageEmbed().setColor("#00FFFD")
            .setDescription(`**유튜브 검색중 🔍 [\`LINK\`](${args.join(" ")})**`))
          //if not
        }
        else { //send searching TITLE
          message.channel.send(new MessageEmbed().setColor("#00FFFD")
            .setDescription(`**유튜브 검색중 🔍 \`${args.join(" ")}\`**`))
        }
        //Set selfdeaf and serverdeaf true
        queueConstruct.connection.voice.setSelfDeaf(true);
        queueConstruct.connection.voice.setDeaf(true);
      }
    }
    catch {
    }
    //if its a valdi youtube link
    if (urlValid) {
      try {
        songInfo = await ytsr.searchOne(search) ;
        song = {
          title: songInfo.title,
          url: songInfo.url,
          thumbnail: songInfo.thumbnail,
          duration: songInfo.durationFormatted,
       };
      } catch (error) {
        if (error.statusCode === 403) return attentionembed(message, "Max. uses of api Key, please refresh!");
        console.error(error);
        return attentionembed(message, error.message);
      }
    }
    //else try to find the song via ytsr
    else {
      try {
       //get the result
        songInfo = await ytsr.searchOne(search) ;
        song = {
          title: songInfo.title,
          url: songInfo.url,
          thumbnail: songInfo.thumbnail,
          duration: songInfo.durationFormatted,
       };
      } catch (error) {
        console.error(error);
        return attentionembed(message, error);
      }
    }
    //get the thumbnail
    let thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png"
    if (song.thumbnail === undefined) thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png";
    else thumb = song.thumbnail.url;
    //if there is a server queue send that message!
    if (serverQueue) {
      //Calculate the estimated Time
      let estimatedtime = Number(0);
      for (let i = 0; i < serverQueue.songs.length; i++) {
        let minutes = serverQueue.songs[i].duration.split(":")[0];
        let seconds = serverQueue.songs[i].duration.split(":")[1];
        estimatedtime += (Number(minutes)*60+Number(seconds));
      }
      if (estimatedtime > 60) {
        estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
        estimatedtime = estimatedtime + " 분"
      }
      else if (estimatedtime > 60) {
        estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
        estimatedtime = estimatedtime + " 시"
      }
      else {
        estimatedtime = estimatedtime + " 초"
      }
      //Push the ServerQueue
      serverQueue.songs.push(song);
      //the new song embed
      const newsong = new MessageEmbed()
        .setTitle("**[ 재생목록 추가 ] \n\n**   " 
                 + song.title)
        .setColor("#00FFFD")
        .setThumbnail(thumb)
        .setURL(song.url)
        .setDescription(`\`\`\`대기열에 추가되었습니다.\`\`\``)
        .addField("재생 종료 까지 예상 시간:", `\`${estimatedtime}\``, true)
        .addField("재생목록 위치:", `**\`${serverQueue.songs.length - 1}\`**`, true)
        .setFooter(`요청 유저: ${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      //send the Embed into the Queue Channel
        return serverQueue.textChannel
        .send(newsong)
        .catch(console.error);

    }
    //push the song list by 1 to add it to the queu
    queueConstruct.songs.push(song);
    //set the queue
    message.client.queue.set(message.guild.id, queueConstruct);
    //playing with catching errors
    try {

      //try to play the song
      play(queueConstruct.songs[0], message, client);
    } catch (error) {
      //if an error comes log
      console.error(error);
      //delete the Queue
      message.client.queue.delete(message.guild.id);
      //leave the channel
      await channel.leave();
      //sent an error message
      return attentionembed(message, `채널에 입장할 수 없습니다.: ${error}`);
    }
  }
};

//////////////////////////////////////////
//////////////////////////////////////////
/////////////by Tomato#6966///////////////
