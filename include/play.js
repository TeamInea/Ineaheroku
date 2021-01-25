////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const ytdl = require("discord-ytdl-core");
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed, splitMessage, escapeMarkdown, MessageAttachment } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const createBar = require("string-progressbar");
const lyricsFinder = require("lyrics-finder");
const {
  approveemoji,
  denyemoji,
  BOTNAME,
} = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  async play(song, message, client, filters) {
    //get the queue!
    const queue = message.client.queue.get(message.guild.id);
    //if no song provided
    if (!song) {
      //leave the channel
      queue.channel.leave();
      //delete the queue for this server
      message.client.queue.delete(message.guild.id);
      //define the embed
      const endembed = new MessageEmbed().setColor("#00FFFD")
        .setAuthor(`재생목록에 있는 노래를 다 재생하여 종료되었습니다.`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      //set the embed
      return queue.textChannel.send(endembed).catch(console.error);
    }
    //do some variables defining
    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus"; //if its youtube change streamtype
    let isnotayoutube = false; //is not a youtube
    let seekTime = 0; //seektime to 0
    let oldSeekTime = queue.realseek; //the seek time if you skipped the song it would reset it himself, this provents it
    let encoderArgstoset; //encoderargs for the filters only for youtube tho
    if (filters) {
      //if filter is remove
      if (filters === "remove") {
        //clear the filters (actual setting them to something clean which stopps earraping)
        queue.filters = ['-af', 'dynaudnorm=f=200'];
        //defining encodersargs
        encoderArgstoset = queue.filters;
        //try to get seektime
        try {
          //set seektime to the howlong a song is playing plus the oldseektime
          seekTime = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + oldSeekTime;
        }
        //catch if try is not possible
        catch {
          //set seektime to 0
          seekTime = 0;
        }
        //set the realseek time with seektime
        queue.realseek = seekTime;
      }
      else {
        //try to get seektime
        try {
          //set seektime to the howlong a song is playing plus the oldseektime
          seekTime = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + oldSeekTime;
        }
        //catch if try is not possible
        catch {
          //set seektime to 0
          seekTime = 0;
        }
        //set the realseek time with seektime
        queue.realseek = seekTime;
        //push the queue filters array so that you can have multiple filters
        queue.filters.push(filters)
        //set the encoderargs to the filters
        encoderArgstoset = ['-af', queue.filters]
      }

    }


    try {
      if (song.url.includes("youtube.com")) {
        stream = ytdl(song.url, {
          filter: "audioonly",
          opusEncoded: true,
          encoderArgs: encoderArgstoset,
          bitrate: 320,
          seek: seekTime,
          quality: "highestaudio",
          liveBuffer: 40000,
          highWaterMark: 1 << 50,

        });
      } else if (song.url.includes(".mp3") || song.url.includes("baseradiode")) {
        stream = song.url;
        isnotayoutube = true;
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return attentionembed(message, `**Error**: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    if (isnotayoutube) {
      console.log("TEST")
      const dispatcher = queue.connection
        .play(stream)
        .on("finish", () => {
          if (collector && !collector.ended) collector.stop();

          if (queue.loop) {
            let lastSong = queue.songs.shift();
            queue.songs.push(lastSong);
            module.exports.play(queue.songs[0], message);
          } else {
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
          }
        })
        .on("error", (err) => {
          console.error(err);
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        });
      dispatcher.setVolumeLogarithmic(queue.volume / 100);
    } else {
      const dispatcher = queue.connection
        .play(stream, { type: streamType })
        .on("finish", () => {
          if (collector && !collector.ended) collector.stop();

          if (queue.loop) {
            let lastSong = queue.songs.shift();
            queue.songs.push(lastSong);
            module.exports.play(queue.songs[0], message);
          } else {
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
          }
        })
        .on("error", (err) => {
          console.error(err);
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        });
      dispatcher.setVolumeLogarithmic(queue.volume / 100);
    }

    let thumb;
    if (song.thumbnail === undefined) thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png";
    else thumb = song.thumbnail.url;

    try {
      const newsong = new MessageEmbed()
      .setTitle("**[ 지금 재생중인 노래 ]** \n\n"
      + song.title)
    .setURL(song.url)
    .setColor("#00FFFD")
    .setThumbnail(thumb)
    .setFooter(`요청한 유저: ${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
    .addField("시간:", `\`${song.duration} 분\``, true)

      var playingMessage = await queue.textChannel.send(newsong);


      await playingMessage.react("769915194444480542"); //skip
      await playingMessage.react("769912238236106793"); //pause
      await playingMessage.react("769913064194834511"); //loop
      await playingMessage.react("769915194066862080"); //stop
      await playingMessage.react("769940554481532938"); //np
      await playingMessage.react("769945882120028160"); //queue
      await playingMessage.react("769938447279456296"); //lyrics
    } catch (error) {
      console.error(error);
    }





    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", async (reaction, user) => {
      if (!queue) return;

      const member = message.guild.member(user);


      if (member.voice.channel !== member.guild.me.voice.channel) {

        member.send(new MessageEmbed()
          .setTitle("**Error** | 이네아 봇과 같은 채널에 있어야 합니다.")
          .setColor("#00FFFD"))

        reaction.users.remove(user).catch(console.error);

        console.log("not in the same ch.");

        return;
      }

      switch (reaction.emoji.id) {
        //queue
        case "769945882120028160":
          reaction.users.remove(user).catch(console.error);
          const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

          let queueEmbed = new MessageEmbed()
            .setTitle("**[ 음악 재생목록 ]**")
            .setDescription(description)
            .setColor("#00FFFD")
            ;

          const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
          });

          splitDescription.forEach(async (m) => {

            queueEmbed.setDescription(m);
            message.react(approveemoji)
            message.channel.send(queueEmbed);
          });
          break;
        //np
        case "769940554481532938":
          reaction.users.remove(user).catch(console.error);
          const song = queue.songs[0];
          //get current song duration in s
          let minutes = song.duration.split(":")[0];
          let seconds = song.duration.split(":")[1];
          let ms = (Number(minutes) * 60 + Number(seconds));
          //get thumbnail
          let thumb;
          if (song.thumbnail === undefined) thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png";
          else thumb = song.thumbnail.url;
          //define current time
          const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
          //define left duration
          const left = ms - seek;
          //define embed
          let nowPlaying = new MessageEmbed()
            .setTitle("**[ 지금 재생중인 노래 ]**")
            .setDescription(`[**${song.title}**](${song.url})`)
            .setThumbnail(song.thumbnail.url)
            .setColor("#00FFFD")
            .setFooter("재생종료 까지 남은 시간:" + new Date(left * 1000).toISOString().substr(11, 8));
          //if its a stream
          if (ms >= 10000) {
            nowPlaying.addField("\u200b", "🔴 LIVE", false);
            //send approve msg
            return message.channel.send(nowPlaying);
          }
          //If its not a stream
          if (ms > 0 && ms < 10000) {
            nowPlaying.addField("\u200b", "**[" + createBar((ms == 0 ? seek : ms), seek, 25, "▬")[0] + "]**\n**" + new Date(seek * 1000).toISOString().substr(11, 8) + " / " + (ms == 0 ? " ◉ LIVE" : new Date(ms * 1000).toISOString().substr(11, 8)) + "**", false);
            //send approve msg
            return message.channel.send(nowPlaying);
          }

          break;
        //skip
        case "769915194444480542":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          const skipembed = new MessageEmbed().setColor("#00FFFD").setAuthor(`${user.username}님께서 노래를 스킵했습니다.`, "https://cdn.discordapp.com/attachments/748633941912584333/753201474691137647/next.png")
          queue.textChannel.send(skipembed).catch(console.error);

          collector.stop();

          break;
        //lyrics
        case "769938447279456296":

          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          let lyrics = null;
          let temEmbed = new MessageEmbed()
            .setAuthor("검색중...", "https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1").setFooter("**가사 찾는 중** 기다려주세요!")
            .setColor("#00FFFD")
          let result = await message.channel.send(temEmbed)
          try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = `가사가 없습니다. ${queue.songs[0].title}.`;
          } catch (error) {
            lyrics = `가사가 없습니다. ${queue.songs[0].title}.`;
          }

          let lyricsEmbed = new MessageEmbed()
            .setTitle(`**${queue.songs[0].title}**`)
            .setDescription(lyrics)
            .setColor("#00FFFD")

          if (lyricsEmbed.description.length >= 2048)

            lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
          message.react(approveemoji);
          return result.edit(lyricsEmbed).catch(console.error);

          break;
        //pause
        case "769912238236106793":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            const pausemebed = new MessageEmbed().setColor("#00FFFD")
              .setAuthor(`${user.username}님께서 노래를 일시중지 시켰습니다.`, "https://cdn.discordapp.com/emojis/769912238236106793.png")
            queue.textChannel.send(pausemebed).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            const playembed = new MessageEmbed().setColor("#00FFFD")
              .setAuthor(`${user.username}님께서 노래를 다시 재생시켰습니다.`, "https://cdn.discordapp.com/emojis/769912238236106793.png")
            queue.textChannel.send(playembed).catch(console.error);
          }
          break;
        //loop
        case "769913064194834511":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          const loopembed = new MessageEmbed().setColor("#00FFFD")
            .setAuthor(`음악 반복 ${queue.loop ? " enabled" : " disabled"}`, "https://cdn.discordapp.com/emojis/769913064194834511.png")
          queue.textChannel.send(loopembed).catch(console.error);
          break;
        //stop
        case "769915194066862080":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          const stopembed = new MessageEmbed().setColor("#00FFFD").setAuthor(`${user.username}님께서 음악을 중지 시켰습니다.`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
          queue.textChannel.send(stopembed).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
