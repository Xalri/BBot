const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Temporarily ban a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('The duration of the ban (e.g., 10m, 1h)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(target.id);

        

        const embed2 = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle("You have been banned")
            .setDescription(`You have been banned from ${interaction.guild.name}`)
            .addFields(
                { name: 'Reason', value: `${reason}`, inline: true },
                { name: 'Ban Duration', value: `${duration}`, inline: true }
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
                .setTitle('User Temporarily Banned')
                .setDescription(`${targetMember.user.tag} has been temporarily banned.`)
                .addFields(
                    { name: 'User', value: `${targetMember.user.tag}`, inline: true },
                    { name: 'User ID', value: `${targetMember.user.id}`, inline: true },
                    { name: 'Reason', value: `${reason}` },
                    { name: 'Duration', value: `${duration}`, inline: true }
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


        const durationMs = ms(duration);
        if (!durationMs) {
            return interaction.reply({ content: 'Invalid duration format. Please use e.g., 10m, 1h', ephemeral: true });
        }


        setTimeout(async () => {
            try {
                await interaction.guild.members.unban(target.id, 'Ban duration expired');
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle("You have been unbanned")
                    .setDescription(`You have been unbanned from ${interaction.guild.name}`)
                    .setFooter({ 
                        text: `By Hollow Bot`
                    })
                    .setTimestamp();

                await targetMember.send({ embeds: [embed] });
                await targetMember.send({})
                console.log(`Unbanned ${target.tag} after ${duration}`);
            } catch (error) {
                console.error(`Failed to unban ${target.tag}:`, error);
            }
        }, durationMs);
    },
};
