const { Client, Collection, MessageEmbed } = require(`discord.js`);
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);
const db = require('quick.db');

module.exports = {
  name: `노래`,
  description: `음악의 모든 명령어를 볼수 있습니다.`,
  aliases: ["Music", "music", "음악"],
  cooldown: 3,
  edesc: "Type help to get a short preview of all Commands, Type help <COMMANDNAME> to get extended information about this one command!",
  async execute(message,args,client) {

    let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = PREFIX;
    //react with approve emoji
    message.react("769665713124016128");
    //define the commands as a command
    let commands = message.client.commands.array();
    //define the help embed
    let helpEmbed = new MessageEmbed()
      .setTitle("이네아 노래 도움말")
      .setDescription(`**Version:** \`v1.0\` \n**PREFIX:** \`${PREFIX}\``)
      .setFooter( client.user.username +` ${prefix}노래 <Command> `, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      .setColor("#00FFFD");
    //define argstrue to negative
    let ifargstruedothis = -1;

      switch(args[0]){
          case "필터":
           ifargstruedothis=0;
          break;
          case "반복":
            ifargstruedothis=1;
          break;
          case "가사":
            ifargstruedothis=2
          break;
          case "재생중인노래":
            ifargstruedothis=3
          break;
          case "일시정지":
            ifargstruedothis=4
          break;
          case "플레이":
            ifargstruedothis=5
          break;
          case "playlist":
            ifargstruedothis=6
          break;
          case "재생목록":
            ifargstruedothis=7
          break;
          case "라디오":
            ifargstruedothis=8
          break;
          case "삭제":
            ifargstruedothis=9
          break;
          case "재개":
            ifargstruedothis=10
          break;
          case "검색":
            ifargstruedothis=11
          break;
          case "바꾸기":
            ifargstruedothis=12
          break;
          case "스킵":
            ifargstruedothis=13
          break;
          case "부분스킵":
            ifargstruedothis=14
          break;
          case "중지":
            ifargstruedothis=15
          break;
          case "볼륨":
            ifargstruedothis=16
          break;
          case "botlist":
            ifargstruedothis=17
          break;
          case "노래":
            ifargstruedothis=18
          break;
          default:
            commands.forEach((cmd) => {
              helpEmbed.addField(
                `**${prefix}${cmd.name}**`,
                `${cmd.description}`,
                true
              );
            });
          if(!message.guild) {
            if(!args[0]) {message.react(approveemoji);return message.author.send(helpEmbed);}
            return
            }
            message.react(approveemoji);
            message.author.send(new MessageEmbed().setColor("#00FFFD")
            .setDescription(`**👍 Sent from <#${message.channel.id}>**`))
            message.author.send(helpEmbed)
            message.channel.send( new MessageEmbed().setColor("#00FFFD")
            .setDescription(`**👍 ${message.author} 이네아 봇의 DM을 확인해주세요!**`)
            );

        break;
       }

       if(ifargstruedothis>=0){
         let aliases = commands[ifargstruedothis].aliases;
         if(aliases === undefined || !aliases) aliases="No Aliases!";
         let cooldown = commands[ifargstruedothis].cooldown;
         if(cooldown === undefined || !cooldown) cooldown="No Cooldown!";


        helpEmbed.addField(
          `**${prefix}${commands[ifargstruedothis].name}**`,
          `\`\`\`fix\n${commands[ifargstruedothis].edesc}\n\`\`\`\n\`${commands[ifargstruedothis].description}\``
        );
        helpEmbed.addField(
          `**:notes: Aliases:**`,
          `\`${aliases}\``
        );
        helpEmbed.addField(
          `**:wrench: Cooldown:**`,
          `\`${cooldown}\``
        );
        if(!message.guild) return message.author.send(helpEmbed);
          message.author.send(helpEmbed)
          message.channel.send( new MessageEmbed().setColor("#00FFFD")
          .setDescription(`**👍 ${message.author} 이네아 봇의 DM을 확인해주세요!**`)
        );
        if(!message.guild) return message.author.send(helpEmbed);
          message.author.send(helpEmbed)
          message.channel.send( new MessageEmbed().setColor("#00FFFD")
          .setDescription(`**👍 ${message.author} 이네아 봇의 DM을 확인해주세요!**`)
          );
       }

}
}
