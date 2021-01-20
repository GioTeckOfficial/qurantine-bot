try {
const ds=require("discord.js")
const fs=require("fs");


const client=new ds.Client();
const config=require("./config.json");
client.login(config.token);

client.on('ready',()=>{
    console.log(`${client.user.tag} is ready!`);
    client.user.setActivity("mettere in quarantena",{type:'PLAYING'});
})

client.on('message', async (message)=>{
    const quarantine=require("./quarantine.json");
    const man=require("./channel.json")
    const after=require("./after.json");
    const use = require("./role.json").role;
    if(message.content=="invite"){
        let embed=new ds.MessageEmbed()
            .setTitle("Invitami!")
            .setDescription("Per invitare il bot usa il link qui sotto:\n https://discord.com/api/oauth2/authorize?client_id=800979258474102834&permissions=8&scope=bot")
            .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
        message.reply(embed);
    }else{
        if(message.guild){
            const args=message.content.split(" ");
            for (let index = 0; index < args.length; index++) {
                if(!args[index]){
                    args.splice(index,1);
                }
            }
            const error=new ds.MessageEmbed()
                .setTitle(":x: Errore!")
                .setDescription("Non hai i permessi o hai formulato male il comando!")
                .setColor("#54aedb")
                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
            const mention=await message.mentions.members.first();
                switch(args[0]){
                case "/quarantine":
                    if(!mention) return message.reply(error);
                    if(message.member.id!==message.guild.ownerID){
                        if(message.member.id!==621692762449903617){
                            if (mention.roles.cache.some(role=>{role.id!==use})) return message.reply(error);
                        }
                    }
                    const role_=mention.roles.cache.array();
                    for (let index = 0; index < role_.length; index++) {
                        mention.roles.remove(role_[index]);
                    }
                    const role_e = message.guild.roles.cache.find(role => role.id==quarantine.role);
                    const member = message.mentions.members.first();
                    await member.roles.add(role_e.id).catch((err)=>{console.log(err)});
                    let dmquarantine=new ds.MessageEmbed()
                        .setTitle("Sei in quarantena!")
                        .setDescription(fs.readFileSync("./staffer.txt"))
                        .setColor("#54aedb")
                        .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                    await member.send(dmquarantine);

                    const create=new Date();
                    var expire=1;
                    function levaultimo(str){
                        len = str.length;
                        str = str.substr(0,len-1);
                        return str;
                    }
                    if(!args[2]){
                        expire=60
                    }else if(args[2].endsWith("d")){
                        var raw=levaultimo(args[2]);
                        expire=raw*24*60
                    }else if(args[2].endsWith("h")){
                        var raw=levaultimo(args[2]);
                        expire=raw*60
                    }else if(args[2].endsWith("m")){
                        var raw=levaultimo(args[2]);
                        expire=raw
                    }else{
                        expire=60;
                    }
                    console.log("Created: " + create);
                    console.log("Expire: "+expire);
                    fs.writeFile(`./members/${mention.id}.json`,`{
                        "memberId":${mention.id},
                        "username":"${mention.user.username}",
                        "createdAt":"${create}",
                        "expiresAfter":"${expire}"
                    }`,(err)=>{
                        if(err) return console.log(err);
                        let channel=await client.channels.cache.get(man.channel);
                        let embed=new ds.MessageEmbed()
                            .setTitle(message.mentions.members.first())
                            .setDescription(`è stato/a messo in quarantena per ${expire} minuti da ${message.member}`)
                        channel.send(embed);
                    });
                    setTimeout(async ()=>{
                        await message.mentions.members.first().roles.remove(role_e).catch(err=>console.log(err));
                        await message.mentions.members.first().roles.add(message.guild.roles.cache.find(role => role.id==after.role).id).catch(err=>console.log(err));
                        let channel= await client.channels.cache.get(man.channel);
                        let embed=new ds.MessageEmbed()
                            .setTitle(message.mentions.members.first())
                            .setDescription(`è uscito dalla quarantena!`);
                        channel.send(embed);
                    },expire*60*1000);
                    break;
                case "/use":
                    if(!args[1]) return message.reply(error);
                    if(!message.mentions.roles.first()){
                        message.reply("Non hai mezionato nessuno!");
                    }else
                    if(message.member.id==message.guild.ownerID){
                        if(message.member.id!==621692762449903617){
                            if (mention.roles.cache.some(role=>{role.id!==role})) return message.reply(error);
                        }
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
                case "/set":
                    if(!args[1]) return message.reply(error);
                    if(message.member.id==message.guild.ownerID){
                        if(message.member.id!==621692762449903617){
                            if (mention.roles.cache.some(role=>{role.id!==role})) return message.reply(error);
                        }
                    }
                        const ret = message.mentions.roles.firstKey();
                        console.log(ret)
                        fs.writeFile("./quarantine.json",`{"role":${ret}}`,(err)=>{
                            if(err) return console.error(err);
                            let succ=new ds.MessageEmbed()
                                .setTitle(":ok:")
                                .setDescription(`Il ruolo ${message.mentions.roles.first()} è stato impostato come il ruolo di quarantena!`)
                                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                            message.reply(succ);
                    });
                    break;
                case "/channel":
                    if(message.member.id==message.guild.ownerID){
                        if(message.member.id!==621692762449903617){
                            if (mention.roles.cache.some(role=>{role.id!==role})) return message.reply(error);
                        }
                    }
                    fs.writeFile('./channel.json',`{"channel":${message.channel.id}}`,(err)=>{
                        if(err) return console.log(err);
                        let succ=new ds.MessageEmbed()
                                .setTitle(":ok:")
                                .setDescription(`Il canale ${message.channel.name} riceverà gli avvisi di quarantena!`)
                                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                            message.reply(succ);
                    });
                    break;
                case "/after":
                    if(!args[1]) return message.reply(error);
                    if(message.member.id==message.guild.ownerID){
                        if(message.member.id!==621692762449903617){
                            if (mention.roles.cache.some(role=>{role.id!==role})) return message.reply(error);
                        }
                    }
                    if(!message.mentions.roles.first()) return message.reply(error);
                    fs.writeFile('./after.json',`{"role":${message.mentions.roles.first().id}}`,(err)=>{
                        if(err) return console.log(err);
                        let succ=new ds.MessageEmbed()
                        .setTitle(":ok:")
                        .setDescription(`Il ruolo ${message.mentions.roles.first()} è il ruolo per quando si esce dalla quarantena!`)
                        .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                    message.reply(succ);
                    })
                    break;
                case "/revoke":
                    const role_q = message.guild.roles.cache.find(role => role.id==quarantine.role);
                    //if(!args[1]) return message.reply(error);
                    if(!mention) return message.reply(error);
                    if(message.member.id==message.guild.ownerID){
                        if(message.member.id!==621692762449903617){
                            if (mention.roles.cache.some(role=>{role.id!==role})) return message.reply(error);
                        }
                    }
                    message.mentions.members.first().roles.remove(role_q).catch(err=>console.log(err));
                    message.mentions.members.first().roles.add(message.guild.roles.cache.find(role => role.id==after.role).id).catch(err=>console.log(err));
                    
                    fs.unlink(`./members/${mention.id}.json`,(err)=>{
                        if(err) return console.log(err);
                        let succ=new ds.MessageEmbed()
                        .setTitle(":ok:")
                        .setDescription(`${mention} è uscito dalla quarantena!`);
                    message.reply(succ);
                    })
                    break;
                case "/help":
                    if(message.member.id!==621692762449903617){
                        if(message.member.id!==message.guild.ownerID) return message.reply(error);
                    }
                    let help=new ds.MessageEmbed()
                        .setTitle("Help")
                        .setURL('https://www.notion.so/gioteck/VinnyHub-Quarantine-6d449865cfb04dcda316acb68352437a')
                        .setDescription("Clicca sul titolo per vedere tutti i comandi!");
                        message.reply(help);
                    break;
                case "/test":
                    console.log(message.member.id);
                    for (let index = 0; index < args.length; index++) {
                        console.log(args[index])
                        
                    }
                    break;
            }
        }
    }
});
} catch (error) {
    console.error(error);
}