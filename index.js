try {
const { time, timeStamp } = require("console");
const ds=require("discord.js")
const fs=require("fs");

const quarantine=require("./quarantine.json");

const client=new ds.Client();
const config=require("./config.json");
const { role } = require("./role.json");
client.login(config.token);

client.on('ready',()=>{
    console.log(`${client.user.tag} is ready!`);
})

client.on('message', async (message)=>{
    if(message.content=="invite"){
        let embed=new ds.MessageEmbed()
            .setTitle("Invitami!")
            .setDescription("Per invitare il bot usa il link qui sotto:\n https://discord.com/api/oauth2/authorize?client_id=800979258474102834&permissions=8&scope=bot")
            .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
        message.reply(embed);
        var response=true;
    }else{
        if(message.guild){
            const args=message.content.split(" ");
            const error=new ds.MessageEmbed()
                .setTitle(":x: Errore!")
                .setDescription("Non hai i permessi o hai formulato male il comando!")
                .setColor("#54aedb")
                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
            const mention=await message.mentions.members.first();
                switch(args[0]){
                case "q!quarantine":
                    if(!args[1]) return message.reply(error);
                    if(!mention) return message.reply(error);
                    if(message.member.id==message.guild.ownerID){
                        if (mention.roles.cache.some(role=>{role.id!==role})) return message.reply(error);
                    }
                    const role_=mention.roles.cache.array();
                    for (let index = 0; index < role_.length; index++) {
                        mention.roles.remove(role_[index]);
                    }
                    const role_e = message.guild.roles.cache.find(role => role.id==quarantine.role);
                    const member = message.mentions.members.first();
                    await member.roles.add(role_e.id);
                    const d=new Date();
                    var create=d.getTime();
                    if(!args[2]){
                        var expire=d.getHours()+1;
                        expire=new Date(d.getFullYear(),d.getMonth(),d.getDate(),expire)
                    }else if(args[2].endsWith("d")){
                        let raw=args[2].slice(args[2].length-1,1);
                        var expire=d.getDate()+raw;
                        expire=new Date(d.getFullYear(),d.getMonth(),expire);
                    }else if(args[2].endsWith("h")){
                        let raw=args[2].slice(args[2].length-1,1);
                        var expire=d.getHours()+raw;
                        console.log(raw)
                        expire=new Date(d.getFullYear(),d.getMonth(),d.getDate(),expire);
                    }else if(args[2].endsWith("m")){
                        let raw=args[2].slice(args[2].length-1,1);
                        var expire=d.getMinutes()+raw;
                        expire=new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),expire);
                    }else{
                        var expire=d.getHours()+1;
                        expire=new Date(d.getFullYear(),d.getMonth(),d.getDate(),expire)
                    }
                    console.log(expire);
                    var reason="Hai infranto le regole del server!";
                    if(args[3]){
                        reason=args[3];
                    }
                    fs.writeFile(`./members/${mention.id}.json`,`{
                        "memberId":${mention.id},
                        "username":"${mention.user.username}",
                        "createdAt":"${create}",
                        "expiresAt":"${expire}",
                        "reason":"${reason}"
                    }`,(err)=>{
                        if(err) return console.log(err);
                        console.log(`${mention.user.tag} è stato messo in quarantena per ${(expire-create)} minuti per ragione: ${reason}`);
                        let succ=new ds.MessageEmbed()
                            .setTitle(":ok:")
                            .setDescription(`${mention} è stato messo in quarantena!`);
                        message.reply(succ);
                    });
                    setTimeout(()=>{
                        member.roles.remove(role_e);
                    },expire-create);
                    break;
                case "q!use":
                    if(!args[1]) return message.reply(error);
                    if(!message.mentions.roles.first()){
                        message.reply("Non hai mezionato nessuno!");
                    }else
                    if(message.member.id!==message.guild.ownerID){
                        message.reply("Non sei l'owner del server!");
                    }else{
                        fs.writeFile("./role.json",`{ "role":${message.mentions.roles.first().id} }`,(err)=>{
                            if(err) return console.error(err);
                            let succ=new ds.MessageEmbed()
                                .setTitle(":ok:")
                                .setDescription(`Il ruolo ${message.mentions.roles.first()} può usare il comando q!quarantine`)
                                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                            message.reply(succ);
                        });
                    }
                    break;
                case "q!set":
                    if(!args[1]) return message.reply(error);
                    if(message.member.id!==message.guild.ownerID) return message.reply(error);
                        const ret = message.mentions.roles.firstKey();
                        console.log(ret)
                        fs.writeFile("./quarantine.json",{role:ret},(err)=>{
                            if(err) return console.error(err);
                            let succ=new ds.MessageEmbed()
                                .setTitle(":ok:")
                                .setDescription(`Il ruolo ${message.mentions.roles.first()} è stato impostato come il ruolo di quarantena!`)
                                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                            message.reply(succ);
                    });
                    break;
                case "q!test":
                    for (let index = 0; index < args.length; index++) {
                        message.reply(args[index]);
                    }
                    message.reply("Finito!");
                    break;
            }
        }
    }
});
} catch (error) {
    console.error(error);
}