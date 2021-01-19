const { time } = require("console");
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
            switch(args[0]){
                case "q!quarantine":
                    if(!args[1]) return message.reply(error);
                    if(!message.mentions.members.first()) return message.reply(error);
                    if(message.member.roles.cache.first()!==role) return message.reply(error);
                    const roles=message.mentions.members.first().roles.cache.array();
                    for (let index = 0; index < roles.length; index++) {
                        message.mentions.members.first().roles.cache.first().delete();
                    }
                    message.mentions.members.first().roles.set(quarantine);
                    let succ=new ds.MessageEmbed()
                        .setTitle(":ok:")
                        .setDescription(`${message.mentions.members.first()} è stato messo in quarantena!`);
                    break;
                case "q!use":
                    const mention= await message.mentions.roles.first();
                    if(!args[1]) return message.reply(error);
                    if(!mention){
                        message.reply("Non hai mezionato nessuno!");
                    }else
                    if(message.member.id!==message.guild.ownerID){
                        message.reply("Non sei l'owner del server!");
                    }else{
                        fs.writeFile("./role.json",`{ "role":${message.mentions.roles.first().id} }`,(err)=>{
                            if(err) return console.error(err);
                            let succ=new ds.MessageEmbed()
                                .setTitle(":ok:")
                                .setDescription(`Il ruolo ${mention} può usare il comando q!quarantine`)
                                .setFooter("VinnyHub","https://media.discordapp.net/attachments/798827498061692928/801018255363538954/WhatsApp_Image_2020-11-24_at_17.27.41.jpeg");
                            message.reply(succ);
                        });
                    }
                    break;
                case "q!set":
                    if(!args[1]) return message.reply(error);
                    if(message.member.id!==message.guild.ownerID) return message.reply(error);
                    fs.writeFile("./quarantine.json",`{ "role":${message.mentions.roles.first().id} }`,(err)=>{
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