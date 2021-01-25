const Discord = require(`discord.js`);
const { Client, Collection, MessageEmbed, MessageAttachment } = require(`discord.js`);
const { readdirSync } = require(`fs`);
const { join } = require(`path`);
const db = require('quick.db');
const { TOKEN, PREFIX, AVATARURL, BOTNAME, } = require(`./config.json`);
const figlet = require("figlet");
const { measureMemory } = require('vm');
const client = new Client({ disableMentions: ``, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login(TOKEN);
client.commands = new Collection();
client.setMaxListeners(0);
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);


const activity = [
  `${PREFIX}도움 | Team Inea`,
  `${client.guilds.cache.size} 개의 서버에서`
]

client.once("ready", () => {
  let i = 0;

  setInterval(() => {
    const index = Math.floor(i);
    client.user.setActivity(activity[index], { type: "PLAYING" });
    i = i + 1;
    if (i === activity.length) i = i - activity.length;
  }, 15000)

});

//this fires when the BOT STARTS DO NOT TOUCH
client.on(`ready`, () => {

  ///////////////////////////////
  ////////////IFCHEMPTY//////////
  //remove everything in between those 2 big comments if you want to disable that the bot leaves when ch. or queue gets empty!
  setInterval(() => {
    let member;
    client.guilds.cache.forEach(async guild => {
      await delay(15);
      member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
      //if not connected
      if (!member.voice.channel)
        return;
      //if alone 
      if (member.voice.channel.members.size === 1) { return member.voice.channel.leave(); }
    });

  }, (5000));
  ////////////////////////////////
  ////////////////////////////////
  figlet.text(`${client.user.username} ready!`, function (err, data) {
    if (err) {
      console.log('Something went wrong');
      console.dir(err);
    }
    console.log('====================================================');
    console.log('');
    console.log('Copyright ⓒ 2021 by MinSeok_P. ALL rights reserved.');
    console.log(`          [ ${client.user.tag} ] 봇이 실행되었습니다.`);
    console.log('');
    console.log('====================================================');
  })

});


//DO NOT TOUCH
client.on(`warn`, (info) => console.log(info))
//DO NOT TOUCH
client.on(`error`, console.error)
//DO NOT TOUCH
//FOLDERS:
//Admin custommsg data FUN General Music NSFW others

commandFiles = readdirSync(join(__dirname, `commands`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `commands`, `${file}`));
  client.commands.set(command.name, command)
}
commandFiles = readdirSync(join(__dirname, `Music`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `Music`, `${file}`));
  client.commands.set(command.name, command)
}
commandFiles = readdirSync(join(__dirname, `others`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `others`, `${file}`));
  client.commands.set(command.name, command)
}


//COMMANDS //DO NOT TOUCH
client.on(`message`, async (message) => {
  if (message.author.bot) return;

  //getting prefix 
  let prefix = await db.get(`prefix_${message.guild.id}`)
  //if not prefix set it to standard prefix in the config.json file
  if (prefix === null) prefix = PREFIX;

  //information message when the bot has been tagged
  if (message.content.includes(client.user.id)) {
    message.reply(new Discord.MessageEmbed().setColor("#00FFFD").setAuthor(`${message.author.username}, My Prefix is ${prefix}, to get started; type ${prefix}help`, message.author.displayAvatarURL({ dynamic: true })));
  }
  //An embed announcement for everyone but no one knows so fine ^w^
  if (message.content.startsWith(`${prefix}embed`)) {
    //define saymsg
    const saymsg = message.content.slice(Number(prefix.length) + 5)
    //define embed
    const embed = new Discord.MessageEmbed()
      .setColor("#00FFFD")
      .setDescription(saymsg)
      .setFooter("이네아 봇", client.user.displayAvatarURL())
    //delete the Command
    message.delete({ timeout: 300 })
    //send the Message
    message.channel.send(embed)
  }

  if (message.content.startsWith(`${prefix}규정`)) {
    const args = message.content.slice(10).split(" ");
    const saymessage = args.join(" ");
    const embedsay = new Discord.MessageEmbed()
      .setDescription(saymessage)
      .setURL("https://www.teaminea.xyz/")
      .setAuthor("Team Inea | Rules", "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      .setColor("#00FFFD")
      .setThumbnail("https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
    message.delete({ timeout: 300 })
    message.channel.send(embedsay);
  }


  if (message.content.startsWith(`${prefix}업데이트공지`)) {
    const args = message.content.slice(7).split(" ");
    const updatemessage = args.join(" ");
    const embedupdate = new Discord.MessageEmbed()
      .setDescription(updatemessage)
      .setURL("https://www.teaminea.xyz/")
      .setAuthor("Team Inea | update", "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      .setColor("#00FFFD")
      .setThumbnail("https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
    message.delete({ timeout: 300 })
    message.channel.send(embedupdate);
  }

  if (message.content.startsWith(`${prefix}전체공지`)) {
    const args = message.content.slice(5).split(" ");
    const sayallmessage = args.join(" ");
    const embedsayall = new Discord.MessageEmbed()
      .setDescription(sayallmessage)
      .setURL("https://www.teaminea.xyz/")
      .setAuthor("Team Inea | Announcement", "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      .setColor("#00FFFD")
      .setThumbnail("https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
    message.delete({ timeout: 300 })
    message.channel.send(embedsayall);
  }
  if (message.content.startsWith(`${prefix}서버통합`)) {
    const args = message.content.slice(7).split(" ");
    const updatemessage = args.join(" ");
    const embedupdate = new Discord.MessageEmbed()
      .setDescription(updatemessage)
      .setAuthor("메잌시티 x Team Inea", "https://cdn.discordapp.com/icons/709777816589435000/68a2c0bf3fdc28da2b92bb429859a516.webp?size=128")
      .setColor("#f5ff00")
      .setThumbnail("https://cdn.discordapp.com/icons/709777816589435000/68a2c0bf3fdc28da2b92bb429859a516.webp?size=128")
      .setFooter("2021-01-24 2:07PM", "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
      message.delete({ timeout: 300 })
    message.channel.send(embedupdate);
  }

  //command Handler DO NOT TOUCH
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        new MessageEmbed().setColor("#00FFFD")
          .setTitle(`**Error** | \`${timeLeft.toFixed(1)} 초 기다려 주세요. \` 명령어: \`${prefix}${command.name}\``)
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply(new MessageEmbed().setColor("#00FFFD")
      .setTitle(`**Error** | 해당 명령을 실행하는 동안 오류가 발생했습니다.`)).catch(console.error);
  }

});
function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

client.on('guildMemberAdd', async (member) => {

  const Channel = member.guild.channels.cache.get('750617569584742402')

  const embed = new Discord.MessageEmbed()
    .setColor('#00FFFD')
    .setTitle(`**현재 인원: \`${member.guild.memberCount}\` 명**`)
    .setDescription(`\`${member.user.tag}\` 님께서 **${member.guild.name}** 서버에 입장하셨습니다.`)
    .setAuthor(`[ ${member.guild.name} ]`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
  Channel.send(embed)
})

client.on('guildMemberRemove', async (member) => {

  const Channel = member.guild.channels.cache.get('750617617919770635')

  const embed = new Discord.MessageEmbed()
    .setColor('#00FFFD')
    .setTitle(`**현재 인원: \`${member.guild.memberCount}\` 명**`)
    .setDescription(`\`${member.user.tag}\` 님이 **${member.guild.name}** 서버에서 나가셨습니다.`)
    .setAuthor(`[ ${member.guild.name} ]`, "https://cdn.discordapp.com/attachments/797430458140196914/797432911498051594/1906.png")
  Channel.send(embed)
})