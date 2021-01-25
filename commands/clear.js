module.exports = {
    name: 'clear',
    aliases: ["청소", "지우개", "채팅청소"],
    description: "Clear messages!",
   async  execute(message, args) {
        if (!args[0]) return message.reply("지울 메시지의 양을 정해주세요.");
 
        if(isNaN(args[0])) return message.reply("숫자를 입력해주세요.");
 
        if(args[0] > 150) return message.reply("150개 이상의 메시지를 지울 수 없습니다.");
        
        if(args[0] < 2) return message.reply("님 2개 이상의 메시지를 삭제 해야합니다.");
 
        await message.channel.messages.fetch({ limit: args[0]}).then(messages =>{
            message.channel.bulkDelete(messages)
    });
 
 }
}   