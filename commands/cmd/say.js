const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say a text.')   
        .addStringOption(option =>
            option.setName("text")
                .setDescription("The text to say")
                .setRequired(true)
        ),
    async execute(interaction) {
        interaction.channel.send(interaction.options.getString('text'));
        interaction.reply({content: "message sent", ephemeral: true})
    }
}