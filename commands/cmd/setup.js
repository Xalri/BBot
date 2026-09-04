const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup channels for your bot.')   
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket')
                .setDescription('Set the ticket message.')
                .addChannelOption(option => option.setName('channel').setDescription('The ticket channel').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('autorole')
                .setDescription('Set the autorole message.')
                .addChannelOption(option => option.setName('channel').setDescription('The autorole channel').setRequired(false))
        ),
    async execute(interaction) {
        interaction.deferReply({ephemeral: true});
        const subcommand = interaction.options.getSubcommand();
        console.log(subcommand);

        const guild_id = interaction.guild.id;
        const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel').id : interaction.channel;
        switch(subcommand){
            case 'ticket':            
                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: false,
                    ViewChannel: true,
                });
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Create a Ticket')
                    .setDescription("🌟✨ Welcome to Support! ✨🌟\n\nTo get the help you need, simply click the button below and choose from the following options:\n\n•    💰 | Purchasing\nTo purchase something.\n\n    •    ❓ | Questions\nTo ask a question.\n\n    •    🛠️ | Support\nTo get support.\n\n    •    ⚠️ | Reporting\nTo report something or someone.\n\n    •    📢 | Adversity\nTo discuss advertising.\n\n    •    🤝 | Partners\nTo talk about partnerships.\n\n    •    👩‍💻 | Recruitment\nTo discuss recruitment.\n\nWe’re here to assist you with whatever you need! 😊");
                const select = new StringSelectMenuBuilder()
                    .setCustomId('ticket')
                    .setPlaceholder('Select a ticket type')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('💰｜Purchasing')
                            .setDescription('To purchase something.')
                            .setValue('purchasing'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('❓｜Questions')
                            .setDescription('To ask a question.')
                            .setValue('questions'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('🛠｜Support')
                            .setDescription('To get support.')
                            .setValue('support'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('⚠｜Reporting')
                            .setDescription('To report something or someone.')
                            .setValue('reporting'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('🚨｜Adversity')
                            .setDescription('To talk about advertising.')
                            .setValue('advertising'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('🤝｜Partners')
                            .setDescription('To talk about partnership.')
                            .setValue('partners'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('🧑💻｜Recruitment')
                            .setDescription('To talk about recruitement.')
                            .setValue('recruitment'),
                    );
                const row = new ActionRowBuilder()
                    .addComponents(select);
                await channel.send({ embeds: [embed], components: [row] });
                await interaction.editReply({ content: `Channel ${channel} has been locked and the ticket embed has been sent.`, ephemeral: true });
                channel_name = "tichannel"
                break;
            case 'autorole':
                console.log("ok")
                const announcement = new ButtonBuilder()
                    .setCustomId('autorole-announcement')
                    .setEmoji('📢')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Announcement');
                
                const sneak_peek = new ButtonBuilder()
                    .setCustomId('autorole-sneak_peak')
                    .setEmoji('👀')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Sneak Peek');
                const giveaway = new ButtonBuilder()
                    .setCustomId('autorole-giveaway')
                    .setEmoji('🎁')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Giveaways');
                const event = new ButtonBuilder()
                    .setCustomId('autorole-event')
                    .setEmoji('📅')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Events');
                const stream = new ButtonBuilder()
                    .setCustomId('autorole-stream')
                    .setEmoji('🎬')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('Streams');
                
                const r = new ActionRowBuilder()
                    .addComponents(announcement, sneak_peek, giveaway,  event, stream);
                const e = new EmbedBuilder()
                    .setTitle('Autorole')
                    .setDescription("🚀✨ Welcome to Our Community! ✨🚀\n\n🎭 Choose Your Role!\nClick on a button below to get notified and stay updated with the latest news and events:\n\n    •    📢 | Announcements\nBe the first to know about important updates!\n\n    •    👀 | Sneak Peek\nGet exclusive previews of what’s coming next!\n\n    •    🎁 | Giveaways\nDon’t miss out on awesome prizes and contests!\n\n    •    📅 | Events\nStay informed about upcoming events and gatherings!\n\n    •    🎥 | Streams\nJoin us for live streams and interact in real-time!")
                await channel.send({embeds: [e], components: [r]});
                await interaction.editReply({ content: `Channel ${channel} has been locked and the autorole embed has been sent.`, ephemeral: true });
                
        }
        
    }
}