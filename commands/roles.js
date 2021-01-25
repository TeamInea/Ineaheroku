const { Client, Collection, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'reactionrole',
    aliases: [],
    description: "Sets up a reaction role message!",
    async execute(message, args, Discord, client) {
        const channel = '802454504942338058';
        const yellowTeamRole = message.guild.roles.cache.find(role => role.name === "Community");
        const blueTeamRole = message.guild.roles.cache.find(role => role.name === "Shop");
 
        const yellowTeamEmoji = '💬';
        const blueTeamEmoji = '🛒';
 
        let embed = new MessageEmbed()
            .setColor('#00FFFD')
            .setTitle(`**[역할선택]** 환영합니다.`)
            .setDescription('자신이 선택할 역할을 선택하여 주세요.\n\n'
                + `${yellowTeamEmoji}는 켜뮤니티 즉 채팅창, 음성방, 게임을 하시는 분들\n`
                + `${blueTeamEmoji}는 주문제작및 구매를 하시는 분들`);
 
        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(yellowTeamEmoji);
        messageEmbed.react(blueTeamEmoji);
 
        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === yellowTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(yellowTeamRole);
                }
                if (reaction.emoji.name === blueTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(blueTeamRole);
                }
            } else {
                return;
            }
 
        });
 
        client.on('messageReactionRemove', async (reaction, user) => {
 
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
 
 
            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === yellowTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(yellowTeamRole);
                }
                if (reaction.emoji.name === blueTeamEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(blueTeamRole);
                }
            } else {
                return;
            }
        });
    }
 
}   