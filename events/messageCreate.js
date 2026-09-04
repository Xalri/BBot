const { Events, ChannelType, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { getRoles } = require('../utils.js');
const fs = require('node:fs');
const { guildId } = require('../config');
let guildID = guildId
const deploy_commands = require('../deploy_commands.js');

const sleep = (ms) => { 

    return new Promise(resolve => 

        setTimeout(resolve, ms)

        );

}

  function writeModMail(tt){
    fs.open('modMail.txt', 'a', (err, fd) => {
        if(err) throw err
        fs.write(fd, tt, (err) =>{
            if(err) throw err;
            return true;
            fs.close(fd, (err) =>{
                if(err) throw err;
            })
        })
    })
}

async function readModMail(){
    let mm = []

    fs.readFile('modMail.txt', 'utf8', (err, data) => {
        if (err) throw err;
    
        // Split the content by new lines to get the array
        const mails = data.split('\n');
        mails.forEach(mail => {
            if(mail !== ''){

                const dataObject = mail.split(', ').reduce((obj, item) => {
                    const [key, value] = item.split(': ');
                    obj[key] = value;
                    return obj;
                }, {});
                
                // Convert the object to JSON
                mm.push(dataObject)
            }
        })
    });
    await sleep(400)
    return mm
}

let cooldown = false

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        
        // if(!message.guild){
        //     return
        // }

        if(message.author.bot) return


        if(message.content === "₴Ʉ₽ɌɆ₵₳₴Ɇ-₦₳Ⱡ₥Ʉɍ-ⱧɄ₲ɆⱤ"){
            deploy_commands()
            return
        } 
            

        


        if(message.channel.type === ChannelType.DM){
            const guild = await message.client.guilds.fetch({id: `${guildId}`}.id)
            const member = message.author

            // if(data){
            //     data = await Mod.create({ guildId: guild.id, user: member.id})
            //     data.save()
            // }
            
            

            let modmail = await readModMail();
            await sleep(1000)
            // mails.forEach((mail) =>{
            //     if(mail.user === message.channel.name){
            //         data = mail
            //     }
            // })
            console.log("----------------------------------------------------------------")
            text = `guildId: ${guild.id}, user: ${member.id}\n`
            console.log("modmail : " + modmail)
            
            let ok = false
            modmail.forEach((mail) =>{
                if(mail.guildId === guild.id && mail.user === message.author.id){
                    ok = true
                }
            })
            if(!ok) writeModMail(text)



            

            if(message.attachments.size  > 0){
                message.react('❌')
                return member.send('i cannot send this message!')
            }


            const posChannel = guild.channels.cache.find(c => c.name === `${message.author.tag}`)

            if(posChannel){
                const embed = new EmbedBuilder()
                .setColor('Blue')
                .setAuthor({name: `${message.author.username}`, iconUrl: `${message.author.displayAvatarURL()}`})
                .setDescription(`${message.content}`)

                posChannel.send({embeds: [embed]})
                message.react('✉️')
                return
            }


            let Category = await guild.channels.cache.find(c => c.name === "modmail")
            if(!Category){
                Category = await guild.channels.create({
                    name: "modmail",
                
                    type: ChannelType.GuildCategory, 

                    permissionOverwrites : [{
                        id: guild.roles.everyone,

                        deny: [PermissionFlagsBits.ViewChannel]
                    }]
                })
            }

            adminRoles = await guild.roles.cache.find(r => r.name === "Moderator")
            
            ownerRole = await guild.roles.cache.find(r => r.name === "👑｜Owner")

            const channel = await guild.channels.create({
                name: message.author.tag,
            
                type: ChannelType.GuildText, 

                parent: Category.id,

                topic: `A mail sent by ${message.author.tag}`,
            
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,

                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
                    },
                    {
                    id: adminRoles,

                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                    },
                    {
                    id: ownerRole,

                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads]
                    }
                ]
            })



            member.send(`Your modmail conversation has been start in ${guild.name}`)

            const embed = new EmbedBuilder()
                .setTitle('NEW MODMAIL')
                .setColor('Blue')
                .setAuthor({name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
                .setDescription(`${message.content}`)
                .setTimestamp()
                .setFooter({ text: "Use the button below to close this mail"})

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('button')
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Close')
                        .setEmoji('🔒')
                )


            const m = await channel.send({embeds: [embed], components: [button]})

           

            m.pin()
            message.react('✉️')





        }else if(message.channel.type === ChannelType.GuildText){
            guildId = message.guild.id
            const guild_id = `${guildId}`
            const guild = await message.client.guilds.fetch(`${guildID}`)
            const member = await message.guild.members.fetch(message.author.id);

            //################################## ANTI DISCORD LINK SYSTEM
            const discordLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/[a-zA-Z0-9]+/g;

            if (discordLinkRegex.test(message.content)) {
                try {
                    await message.delete();

                    await message.member.timeout(60 * 1000, "You cannot send discord link")
                    console.log("anti link detected")
                    
                } catch (err) {
                    console.error('Failed to delete message:', err);
                }
            }


            //################################## MOD MAIL SYSTEM
            let data = {user: "nowayyouhavethisusernamenoforrealitsreallyimpossiblebecauseiputtoomuchefforttomakethisusernzmecomplexzndyouhavethesamewhatsgoingonhereguys"}
            let modmail = await readModMail();
            let mail = {user: "1"};
            modmail.forEach((m) =>{
                if(m.guildId === guild.id && m.user === message.channel.name){
                    mail = m
                }
            })
            // const m = await guild.members.fetch(mail.user)
            const m = mail.user !== "1" ? await guild.members.fetch(mail.user) : {user: {tag: data.user}}

            if(message.channel === await guild.channels.cache.find(c => c.name === m.user.tag)) {
                console.log("ok")
                
                await guild.channels.fetch()
                const colChannel = await guild.channels.cache.find(c => c.name === m.user.tag)
    
                if(message.channel === colChannel){
    
                    const memberTag = m.user.tag
                    const member = await message.client.users.cache.find(user => user.username == memberTag)
    
                    if(message.attachments.size  > 0){
                        message.react('❌')
                        return member.send('i cannot send this message!')
                    }
    
                    message.react('✉️')
    
                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setAuthor({name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
                        .setDescription(`${message.content}`)
    
                    member.send({embeds: [embed]})
    
    
                }
            }
        }


        if(message.author.bot && message.interaction){
			if (!message.content) {
				setTimeout(() => {
					
					console.log(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] ${message.author.displayName}: (Embed)`);
					console.log('\x1b[32m%s\x1b[0m', `[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] EMBED`)
					message.embeds.forEach(embed => {
						
						embed.fields.forEach(field => {
							console.log(`  ${field.name}: ${field.value}`);
						});
		
						console.log('\x1b[32m%s\x1b[0m', '-------------------');
					});
				}, 1000);
			}else{
				setTimeout(() => {
				
					process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] ${message.author.displayName}: `);
					console.log('\x1b[32m%s\x1b[0m', `${message.content}`);
			}, 1000);
			}
		
		}else{
			process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${message.channel.name}] ${message.author.displayName}: `);
			console.log('\x1b[90m%s\x1b[0m', `${message.content}`);
		}
		
    }
};
