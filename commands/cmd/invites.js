const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Gets the number of invites of a user.')   
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The user you want to check the invites of")
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target')
        let invites = await interaction.guild.invites.fetch()
        let userInvites = invites.filter(u => u.inviter && u.inviter.id === user.id);
        
        let i = 0;
        userInvites.forEach((inv) => i += inv.uses)
        console.log(i)
        console.log([...userInvites.values()].sort((a, b) => b.uses - a.uses).slice(0, 5).map(inv => `${user.username} - ${inv.uses} uses`).join('\n'))

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`${user.username}'s Invites`)
            .setDescription(`:white_check_mark: ${user.username} has **${i}** invites.`)
            .addFields(
                { name: 'Total Invites', value: String(i) },
                { name: 'Top 5 Invites', value: [...userInvites.values()].sort((a, b) => b.uses - a.uses).slice(0, 5).map(inv => `${inv.code} - ${inv.uses} uses`).join('\n') }
            )

            await interaction.reply({embeds: [embed]});
    }
}