module.exports={
    execute(message,request,ext){
        const ds=require("discord.js");
        const messagemember=message.mentions.members.first();
        const messagerole=message.mentions.roles.first();
        const footer=message.guild.iconURL();
        const guildname=message.guild.name;
        const usesucc=new ds.MessageEmbed()
            .setTitle(":ok:")
            .setDescription(`Il ruolo ${messagerole} può usare il bot!`)
            .setFooter(guildname,footer);
        const setsucc=new ds.MessageEmbed()
            .setTitle(":ok:")
            .setDescription(`Il ruolo ${messagerole} è il ruolo di quarantena!`)
            .setFooter(guildname,footer);
        const aftersucc=new ds.MessageEmbed()
            .setTitle(":ok:")
            .setDescription(`Il ruolo ${messagerole} è stato impostato come ruolo di uscita dalla quarantena!`)
            .setFooter(guildname,footer);
        const revokeerr=new ds.MessageEmbed()
            .setTitle(":x: Errore!")
            .setDescription("Il membro non è in quarantena!")
            .setFooter(guildname,footer);
        const revokesucc=new ds.MessageEmbed()
            .setTitle(":ok:")
            .setDescription(`L'utente ${messagemember} è stato rimosso dalla quarantena!`)
            .setFooter(guildname,footer);
        const quarantinesucc=new ds.MessageEmbed()
            .setTitle(":ok:")
            .setDescription(`${messagemember} è stato messo in quarantena per ${ext} minuti!`)
            .setFooter(guildname,footer);
        const quarantinefinish=new ds.MessageEmbed()
            .setTitle(":end:")
            .setDescription(`${messagemember} ha finito la quarantena!`)
            .setFooter(guildname,footer);
        switch(request){
            case "errgen":
                const errgen=new ds.MessageEmbed()
                    .setTitle(":x: Errore")
                    .setDescription("Errore generico! Prova a riformulare il comando!")
                    .setFooter("VinnyHub",footer);
                return message.reply(errgen);
            case "errformat":
                const errformat=new ds.MessageEmbed()
                    .setTitle(":x: Errore")
                    .setDescription("Comando formulato male!")
                    .setFooter("VinnyHub",footer);
                return message.reply(errformat);
            case "errperm":
                const errperm=new ds.MessageEmbed()
                    .setTitle(":x: Errore")
                    .setDescription("Non hai i permessi per usare il comando!")
                    .setFooter("VinnyHub",footer);
                return message.reply(errperm);
            case "revokesucc":
                return message.reply(revokesucc);
            case "revokeerr":
                return message.reply(revokeerr);
            case "aftersucc":
                return message.reply(aftersucc);
            case "setsucc":
                return message.reply(setsucc);
            case "usesucc":
                return message.reply(usesucc);
            case "quarantinefinish":
                return message.reply(quarantinefinish);
            case "quarantinesucc":
                return message.reply(quarantinesucc);
        }
    }
}