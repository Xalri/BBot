const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), 
    async execute(interaction) {
        interaction.deferReply()
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!targetMember.bannable) {
            await interaction.editReply({ content: 'I cannot ban this user!', ephemeral: true });
            return;
        }

        const embed2 = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle("You have been banned")
            .setDescription(`You have been banned from ${interaction.guild.name}`)
            .addFields(
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: 'Ban Duration', value: `Forever`, inline: true }
            )
            .setFooter({ 
                text: `By Hollow Bot`
            })
            .setTimestamp();
        await targetMember.send({embeds: [embed2]})

        await interaction.guild.bans.create(targetMember.id, {reason: reason} )
            .then(async () => {
                const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('User Banned')
                .setDescription(`${targetMember.user.tag} has been banned.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`, inline: true },
                    { name: 'User ID', value: `${targetMember.user.id}`, inline: true },
                    { name: 'Reason', value: `${reason}` }
                )
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setTimestamp();

            // Confirm the ban with an embed
                await interaction.editReply({ embeds: [embed]})
                await interaction.followUp({content: `You have banned ${targetUser.tag} [${targetUser.id}]`, ephemeral: true});
            })
            .catch(error => {
                console.error('Error banning member:', error);
                interaction.reply({ content: 'There was an error trying to ban this user.', ephemeral: true });
            });
    },
};
