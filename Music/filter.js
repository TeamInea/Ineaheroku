////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const ytsr = require("youtube-sr")
const { Client, Collection, MessageEmbed } = require("discord.js");
const { play } = require("../include/play")
const { attentionembed } = require("../util/attentionembed");
const { PREFIX, } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "필터",
  description: "오디오 설정 - 효과",
  aliases: ["fi", "filter"],
  cooldown: 0.5,
  edesc: `Type this Command to change the current audio effect - style \nUsage: ${PREFIX}필터 <필터타입>`,

async execute(message, args, client) {
    //if its not in a guild return
    if (!message.guild) return;
    //define channel
    const { channel } = message.member.voice;
    //get serverqueue
    const queue = message.client.queue.get(message.guild.id);
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //if the argslength is null return error
    //if there is already a search return error
    if (message.channel.activeCollector)
      return attentionembed(message, "검색이 활성화 되었습니다.");
    //if the user is not in a voice channel return error
    if (!message.member.voice.channel)
      return attentionembed(message, "채널에 먼저 들어가 주세요.")
    //If not in the same channel return error
    if (queue && channel !== message.guild.me.voice.channel)
      return attentionembed(message, `이네이 봇과 같은 채널에 있어야 합니다.`);
    //Define all filters with ffmpeg    https://ffmpeg.org/ffmpeg-filters.html
    const filters = [
      'bass=g=20,dynaudnorm=f=200',//bassboost
      'apulsator=hz=0.08', //8D
      'aresample=48000,asetrate=48000*0.8',//vaporwave
      'aresample=48000,asetrate=48000*1.25',//nightcore
      'aphaser=in_gain=0.4',//phaser
      'tremolo',//tremolo
      'vibrato=f=6.5',//vibrato
      'surround',//surrounding
      'apulsator=hz=1',//pulsator
      'asubboost',//subboost
      "remove",
    ];
    //set some temporary variables
    let varforfilter; let choice;
    //get user input
    switch (args[0]) {
      case "bassboost", "배스부스트":
        varforfilter = 0;

        break;
      case "8D", "8D사운드":
        varforfilter = 1;
        break;
      case "vaporwave":
        varforfilter = 2;
        break;
      case "nightcore", "나이트코어":
        varforfilter = 3;
        break;
      case "phaser":
        varforfilter = 4;
        break;
      case "tremolo":
        varforfilter = 5;
        break;
      case "vibrato":
        varforfilter = 6;
        break;
      case "surrounding":
        varforfilter = 7;
        break;
      case "pulsator":
        varforfilter = 8;
        break;
      case "subboost", "서브부스트":
        varforfilter = 9;
        break;
      case "clear", "초기화":
      varforfilter = 10;
      break;
      default:
        //fires if not valid input
        varforfilter = 404;
        message.channel.send(new MessageEmbed()
        .setColor("#00FFFD")
        .setTitle("**필터를 골라주세요! (추가된 필터: 11개)**")
        .setAuthor("필터 목록", "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
        .setDescription(`
        \`bassboost, 배스부스트\`
        \`8D, 8D사운드\`
        \`vaporwave\`
        \`nightcore , 나이트코어\`
        \`phaser\`
        \`tremolo\`
        \`vibrato\`
        \`surrounding\`
        \`pulsator\`
        \`subboost, 서브부스트\`
        \`clear, 초기화\`           === 모든 필터를 삭제합니다.`)
        .setThumbnail("https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
        .setFooter(`명령어: ${PREFIX}필터 bassboost`)
        )
        break;
    }
    //set choice to zero
    choice = filters[varforfilter];
    if (varforfilter === 404) return;
    try {
      const song = queue.songs[0];
      //play the collected song song, message, client, filters
      message.channel.send(new MessageEmbed()
      .setColor("#00FFFD")
      .setAuthor("필터를 적용합니다: " + args[0], "https://cdn.discordapp.com/emojis/769935094285860894.gif")).then(msg =>{
        msg.delete({timeout: 2000});
      })
      play(song, message, client, choice);
      //catch any errors while searching
    } catch (error) {
      //log them
      console.error(error);
      //set collector false, just incase its still true
      message.channel.activeCollector = false;
    }
  }
};
