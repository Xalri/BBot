const { Events, PermissionFlagsBits, ChannelType, VoiceChannel } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState) {
        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;


        let vocCategory = guild.channels.cache.find(
            (channel) => channel.name === '🔊・Voice Channels' && channel.type === ChannelType.GuildCategory
        );

        if (!vocCategory) {
            vocCategory = await guild.channels.create({
                name: '🔊・Voice Channels',
                type: ChannelType.GuildCategory,
                position: 0, // Set the category to be at the top
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: [PermissionFlagsBits.ViewChannel],
                        deny: [PermissionFlagsBits.Connect],
                    },
                ],
            });
        } else if (vocCategory.position !== 15) {
            await vocCategory.setPosition(15);
        }

        let vocChannel = guild.channels.cache.find(ch => ch.name === "🎙｜Join To Create" && ch.type === ChannelType.GuildVoice);
        if (!vocChannel) {
            vocChannel = await guild.channels.create({
                name: "🎙｜Join To Create",
                type: ChannelType.GuildVoice,
                parent: vocCategory.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: [PermissionFlagsBits.Connect],
                    },
                ],
            });
        } else if (vocChannel.position !== 0) {
            await vocChannel.setPosition(0);
        }

        if(oldChannel !== newChannel && newChannel && newChannel.id === vocChannel.id){
            const voiceChannel = await guild.channels.create({
                name: `🎙｜${member.user.tag}`,
                type: ChannelType.GuildVoice,
                parent: vocCategory.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.Stream, PermissionFlagsBits.UseExternalSounds, PermissionFlagsBits.UseSoundboard],
                    },
                    {
                        id: member.id,
                        allow: [PermissionFlagsBits.MuteMembers, PermissionFlagsBits.PrioritySpeaker, PermissionFlagsBits.MoveMembers],
                    }
                ],
            })
            await vocChannel.permissionOverwrites.edit(member, {Connect: false})
            setTimeout(async () => await vocChannel.permissionOverwrites.edit(member, {Connect: true}), 30 * 1000)
            setTimeout(async () => await member.voice.setChannel(voiceChannel.id), 500)
            
        }

        if(oldChannel && oldChannel.parentId === vocCategory.id && oldChannel.name === `🎙｜${member.user.tag}` && (!newChannel || newChannel.name !== `🎙｜${member.user.tag}`)){
            await oldChannel.delete()
        }


    }
}