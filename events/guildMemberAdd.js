const { Events, PermissionFlagsBits, ChannelType, VoiceChannel, EmbedBuilder } = require('discord.js');
function write(tt, filename){
    fs.open(filename, 'a', (err, fd) => {
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

async function read(filename){
    let mm = []

    fs.readFile(filename, 'utf8', (err, data) => {
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

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {

        names = ['📜｜rules']
        const channels = 
        await member.guild.channels.cache.forEach(async (channel) => {
            // console.log(!names.includes(channel.name))
            if(!names.includes(channel.name)) {
                await channel.permissionOverwrites.edit(member.id, {
                    ViewChannel: false,
                });
            }else{
                await channel.permissionOverwrites.edit(member.id, {
                    ViewChannel: true,
                });
            }
        })

        let welcomeCategory = member.guild.channels.cache.find(
            (channel) => channel.name === '👋・Welcome & Goodbye' && channel.type === ChannelType.GuildCategory
        );

        if (!welcomeCategory) {
            welcomeCategory = await member.guild.channels.create({
                name: '👋・Welcome & Goodbye',
                type: ChannelType.GuildCategory,
                position: 0, // Set the category to be at the top
                permissionOverwrites: [
                    {
                        id: member.guild.roles.everyone,
                        allow: [PermissionFlagsBits.ViewChannel],
                        deny: [PermissionFlagsBits.SendMessages],
                    },
                ],
            });
        } else if (welcomeCategory.position !== 2) {
            await welcomeCategory.setPosition(2);
        }

        let welcomeChannel = member.guild.channels.cache.find(ch => ch.name === "👋｜welcome" && ch.type === ChannelType.GuildText);
        if (!welcomeChannel) {
            welcomeChannel = await member.guild.channels.create({
                name: "👋｜welcome",
                type: ChannelType.GuildText,
                parent: welcomeCategory.id,
                permissionOverwrites: [
                    {
                        id: member.guild.roles.everyone,
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads],
                    },
                ],
            });
        }

        let inviteCounterChannel = member.guild.channels.cache.find(ch => ch.name === "📮｜invites" && ch.type === ChannelType.GuildText);
        if (!inviteCounterChannel) {
            inviteCounterChannel = await member.guild.channels.create({
                name: "📮｜invites",
                type: ChannelType.GuildText,
                parent: welcomeCategory.id,
                permissionOverwrites: [
                    {
                        id: member.guild.roles.everyone,
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.CreatePrivateThreads, PermissionFlagsBits.CreatePublicThreads],
                    },
                ],
            });
        }

		
	
        try {
            const joinedAt = member.joinedAt;
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const joinedDate = joinedAt.toLocaleDateString('fr-FR', options);
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Welcome to the server!`)
                .setDescription(`Happy to see you <@${member.user.id}>.`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {name:'Joined Server On', value:joinedDate},
                    {name:'Account Created On', value:member.user.createdAt.toDateString()}
                    )
                .setFooter({ 
                    text: 'Enjoy the server!', 
                    iconURL: member.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();
            await welcomeChannel.send({ embeds: [embed] });

            
            
            
            try {
                const currentInvites = await member.guild.invites.fetch();
                const previousInvites = global.inviteCache.get(member.guild.id);
                console.log(previousInvites.size)
                // console.log(global.inviteCache)
                
                if (previousInvites.size == 0) {
                    // No previous invite data available
                    return;
                }
                
                // Find the used invite
                const usedInvite = currentInvites.find(invite => 
                    !previousInvites.has(invite.code) || previousInvites.get(invite.code).uses < invite.uses
                );

                console.log(usedInvite)
                
                if (usedInvite) {
                    const inviter = await member.guild.members.fetch(usedInvite.inviterId);; // Replace with your channel name
                    let invites = await member.guild.invites.fetch()
                    let userInvites = invites.filter(u => u.inviter && u.inviter.id === inviter.user.id);
                    
                    let i = 0;
                    userInvites.forEach((inv) => i += inv.uses)
        
                    console.log(inviteCounterChannel)
                    inviteCounterChannel.send(`${member.user.tag} was invited by ${inviter.user.tag}. ${inviter.user.tag} has ${i} invites`);
                    
                }
        
                // Update the invite cache for future use
                global.inviteCache.set(member.guild.id, currentInvites);
            } catch (error) {
                console.error(`Could not handle invite log for guild ${member.guild.id}:`, error);
            }




            console.log('Join message sent');
        } catch (error) {
            console.error('Error sending custom leave message:', error);
        }






    }
}