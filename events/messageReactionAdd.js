const { Events, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	once: false,
	async execute(reaction, user) {
        const member = await reaction.message.guild.members.fetch(user.id)
        const rule_channel = await reaction.message.guild.channels.fetch("1275146892048732231")
        let rules = await rule_channel.messages.fetch()
        if(rules.size == 0){
            rules = await rule_channel.send(rule_message)
        }else if(rules.size == 1){
            rules = rules.first()
        }else{
            rules = rules.last()
        }

        if(reaction.message.id === rules.id){
            if(reaction.emoji.name === "✅"){
                member.guild.channels.fetch()
                const memberRole = await createRole("👤｜Member", 'Green', reaction.message.guild)
                await member.roles.add(memberRole)
                member.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.delete(member.id);
                });
            }
        }
    }
}

async function createRole(name, color, guild){
    let existingRole = guild.roles.cache.find(role => role.name === name);
    let response;
    if (existingRole) {
        console.log(`Role "${name}" already exists.`);
        response =  existingRole;
    } else {
        try {
            let input = {
                name: `${name}`,
                permissions: [
                    "Connect",
                    "Speak",
                    "MuteMembers",
                    // Add more permissions as needed
                ],
                reason: `Creating a ${name} role`,
            }
            if(color !== "") input.color = color
            const createdRole = await guild.roles.create(input);
            
            
            console.log(`Role "${name}" created successfully.`);
            response = createdRole
        } catch (error) {
            console.error('Error creating role:', error);
            response = "Error with the function"
        }

        
        
    }

  

    return response;

}