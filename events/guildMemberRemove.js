const { Events, PermissionFlagsBits, ChannelType, VoiceChannel, EmbedBuilder } = require('discord.js');


module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        
        if(member.user.bot){
            return
        }
        let goodbyeCategory = member.guild.channels.cache.find(
            (channel) => channel.name === '👋・Welcome & Goodbye' && channel.type === ChannelType.GuildCategory
        );

        if (!goodbyeCategory) {
            goodbyeCategory = await member.guild.channels.create({
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
        } else if (goodbyeCategory.position !== 2) {
            await goodbyeCategory.setPosition(2);
        }

        let goodbyeChannel = member.guild.channels.cache.find(ch => ch.name === "👋｜goodbye" && ch.type === ChannelType.GuildText);
        if (!goodbyeChannel) {
            goodbyeChannel = await member.guild.channels.create({
                name: "👋｜goodbye",
                type: ChannelType.GuildText,
                parent: goodbyeCategory.id,
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
                .setColor('#FF0000')
                .setTitle(`Goodbye, ${member.user.tag}!`)
                .setDescription('We are sad to see you leave.')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Left Server On', value: new Date().toDateString('fr-FR', {timeZone: "Europe/Paris"}) },
                    {name: "Joined Server On", value: joinedDate},
                    { name: 'Account Created On', value: member.user.createdAt.toDateString() }
                )
                .setFooter({ 
                    text: 'Come back soon!', 
                    iconURL: member.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();
            await goodbyeChannel.send({ embeds: [embed] });
            console.log('Leave message sent');
        } catch (error) {
            console.error('Error sending custom leave message:', error);
        }
        
    },
};


async function createLog(member, guild) {

    const guild_id = guild.id

    const db = await Channels.findOne({ guild_id });

    if(!db) return

    const logChannel = await guild.channels.fetch(`${db.lochannel}`)
    // Example: Send a log message to a specific channel or save to a database
    const embed = new EmbedBuilder()
    .setColor("Red")
        .setTitle("Member Leaved")
        .addFields({name: " ", value: `\`Member name\` : ${member.user.tag} \n\`Member ID\` : ${member.id} \n\`Left Server On\` : ${new Date().toDateString('fr-FR', {timeZone: "Europe/Paris"})} \n\`Joined Server On\` :  ${member.joinedAt.toDateString()} \n\`Account Created On\` :  ${member.user.createdAt.toDateString()}`})
        .setTimestamp()
        .setFooter({text: "Mod Logging System"})

    // const embed = new MessageEmbed()
    //     .setTitle('Ghost Ping Detected')
    //     .setDescription(`User ${author} mentioned ${mentionedUsers.map(user => user.toString()).join(', ')} in a message and quickly deleted it.`)
    //     .setColor('#ff0000')
    //     .setTimestamp();

    logChannel.send({ embeds: [embed] });
}