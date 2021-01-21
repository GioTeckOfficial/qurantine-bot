const ds=require("discord.js");
const client=new ds.Client();

const fs=require("fs");

const config=require("./config.json");

client.login(config.token);

client.on("ready",()=>{
    console.log(`${client.user.tag} is ready!`);
    client.user.setActivity("mettere in quarantena",{type:'PLAYING'});
});

client.on('message',async message=>{
    const embed=require("./modules/embed");
    if(!message.content.startsWith(config.prefix)) return;
    let preload=message.content.replace(config.prefix,"");
    const args=preload.split(" ");
    for(let i=0;i<args.length;i++){
        if(!args[i]){
            args=args.slice(i,1);
        }
    }
    const messageauthor=message.author.id;
    const messagemember=message.mentions.members.first();
    const messagerole=message.mentions.roles.first();

    function control(type){
        if(type=="strict"){
            if(!args[1]) return embed.execute(message,"errformat");
            if(messageauthor!==message.guild.ownerID){
                if(message.author.tag!=="GioTeck#5464") return embed.execute(message,"errperm");
            }
            return true;
        }else{
            if(!args[1]) return embed.execute(message,"errformat");
            if(messageauthor!==message.guild.ownerID){
                if(message.author.tag!=="GioTeck#5464"){
                    let role=require("./config/use.json").id;
                    if(message.member.roles.cache.has(role)) embed.execute(message,"errperm");
                }
            }
            return true;
        }
    }
    
    switch(args[0]){
        case "use":
            if(!control("strict")) return;
            if(!messagerole) return embed.execute(message,"errformat");
            fs.writeFile("./config/use.json",`{"id":${messagerole.id}}`,(err)=>{
                if(err) return console.error(err);
                embed.execute(message,"usesucc");
            });
        break;
        case "set":
            if(!control("strict")) return;
            if(!messagerole) return embed.execute(message,"errformat");
            fs.writeFile("./config/set.json",`{"id":${messagerole.id}}`,(err)=>{
                if(err) return console.error(err);
                embed.execute(message,"setsucc");
            })
        break;
        case "after":
            if(!control("strict")) return;
            if(!messagerole) return embed.execute(message,"errformat");
            fs.writeFile("./config/after.json",`{"id":${messagerole.id}}`,err=>{
                if(err) return console.error(err);
                embed.execute(message,"aftersucc");
            })
        break;
        case "revoke":
            if(!control("lol")) return;
            if(!messagemember) return embed.execute(message,"errformat");
            const quarantine_=require("./config/set.json");
            const after_=require("./config/after.json");
            let member=fs.readFileSync(`./members/${messagemember.id}.json`,'utf-8');
            if(!member) return embed.execute(message,"revokeerr");
            fs.unlink(`./members/${messagemember.id}.json`,(err)=>{
                if(err) return console.error(err);
                const role_e = message.guild.roles.cache.find(role => role.id==quarantine_.id);
                messagemember.roles.remove(role_e);
                messagemember.roles.add(message.guild.roles.cache.find(role => role.id==after_.id).id);
                embed.execute(message,"revokesucc");
            });
        break;
        case "quarantine":
            
            if(!control("lol")) return;
            var expire=60;
            if(!messagemember) return embed.execute(message,"errformat");
            if(!args[2]) return embed.execute(message,"errformat");
            
            const quarantine=require("./config/set.json");
            const after=require("./config/after.json");
            const role_=messagemember.roles.cache.array();
            for (let index = 0; index < role_.length; index++) {
                messagemember.roles.remove(role_[index]);
            }
            
            const role_e = message.guild.roles.cache.find(role => role.id==quarantine.id);
            messagemember.roles.add(role_e.id);
            function levaultimo(str){
                len = str.length;
                str = str.substr(0,len-1);
                return str;
            }
            if(args[2].endsWith("d")){
                var raw=levaultimo(args[2]);
                expire=raw*24*60
            }else if(args[2].endsWith("h")){
                var raw=levaultimo(args[2]);
                expire=raw*60
            }else if(args[2].endsWith("m")){
                var raw=levaultimo(args[2]);
                expire=raw
            }
            
            const create=new Date();
            const file=`{
    "staffId":${messageauthor},
    "memberId":${messagemember.id},
    "createdAt":${create},
    "ExpiresAfter":${expire}
}`
            fs.writeFile(`./members/${messagemember.id}.json`,file,err=>{
                if(err) return console.error(err);
                embed.execute(message,"quarantinesucc",expire);
            })
            setTimeout(async ()=>{
                fs.unlink(`./members/${messagemember.id}.json`,async (err)=>{
                    if(err) return console.log(err);
                    messagemember.roles.remove(role_e);
                    messagemember.roles.add(message.guild.roles.cache.find(role => role.id==after.id).id);
                    embed.execute(message,"quarantinefinish");
                });
            },expire*60*1000);
            break;
            default:
                message.reply("unknow");
                break;
    }
    
});

client.on('guildMemberAdd',async member=>{
    let is=fs.readFileSync(`./members/${member.id}.json`,'utf-8');
    setTimeout(()=>{
        if(is){
            const role_=member.roles.cache.array();
            for (let index = 0; index < role_.length; index++) {
                member.roles.remove(role_[index]);
            }
            let quarantine=require("./config/set.json");
            const role_e = member.guild.roles.cache.find(role => role.id==quarantine.id);
            member.roles.add(role_e.id).catch((err)=>{console.log(err)});
        }
    },5000);
});