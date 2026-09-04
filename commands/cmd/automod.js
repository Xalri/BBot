const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
       .setName('automod')
       .setDescription('Setup the automod system')
       .addSubcommand(subcommand => subcommand.setName('flagged-word').setDescription('Block profanity, sexual content, and slurs'))
       .addSubcommand(subcommand => subcommand.setName('spam-messages').setDescription('Block messages suspected of spam'))
       .addSubcommand(subcommand => subcommand.setName('mention-spam').setDescription('Block messages containing a certain amout of mentions').addIntegerOption(option => option.setName('number').setDescription('The number of mention after what the usr will get a sanction')))
       .addSubcommand(subcommand => subcommand.setName('keyword').setDescription('Block a given keyword from the server').addStringOption(option => option.setName('word').setDescription('The word to block from the server'))),
    async execute(interaction) {
        const { guild, options } = interaction
        const sub = interaction.options.getSubcommand()
        interaction.deferReply()

        switch(sub){
            case 'flagged-word':
                await interaction.reply({content: `Loading your automod rule...`, ephemeral: true})

                const rule = await guild.autoModerationRules.create({
                    name: `Block profanity, sexual content, and slurs by Hollow Bot`,
                    creatorId: `${interaction.guild.members.me.id}`,
                    enabled: true,
                    eventType: 1,
                    triggerType: 4,
                    triggerMetadata:
                        {
                            presets: [1, 2, 3]
                        },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: 'This message was prevented by Hollow Bot'
                            }
                        }
                    ]
                })

                setTimeout(async () =>{
                    if (!rule) return;
                    const embed = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(':white_check_mark: Your automod rule has been created. All swears will be stopped by Hollow Bot')

                    await interaction.editReply({embeds: [embed]})
                }, 3000)

                break;

            case 'spam-messages':
                const rule2 = await guild.autoModerationRules.create({
                    name: `Prevent spam messages by Hollow Bot`,
                    creatorId: `${interaction.guild.members.me.id}`,
                    enabled: true,
                    eventType: 1,
                    triggerType: 3,
                    triggerMetadata:
                        {
                            // keywordFilter: [`${word}`]
                        },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: 'This message was prevented by Hollow Bot'
                            }
                        }
                    ]
                })

                setTimeout(async () =>{
                    if (!rule2) return;
                    const embed2 = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(`:white_check_mark: Your automod rule has been created. All messages suspected of spam will be deleted`)

                    await interaction.editReply({embeds: [embed2]})
                }, 3000)

                break;
            case 'mention-spam':
                const number = options.getInteger('number')
                const rule3 = await guild.autoModerationRules.create({
                    name: `Prevent spam mentions by Hollow Bot`,
                    creatorId: `${interaction.guild.members.me.id}`,
                    enabled: true,
                    eventType: 1,
                    triggerType: 5,
                    triggerMetadata:
                        {
                            mentionTotalLimit: number
                        },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: 'This message was prevented by Hollow Bot'
                            }
                        }
                    ]
                })

                setTimeout(async () =>{
                    if (!rule3) return;
                    const embed3 = new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(`:white_check_mark: Your automod rule has been created. All messages containing more than ${number} mentions will be deleted`)

                    await interaction.editReply({embeds: [embed3]})
                }, 3000)

                break;
            case 'keyword':
                    const word = options.getString('word')
                    const rule4 = await guild.autoModerationRules.create({
                        name: `Prevent the word ${word} from being used by Hollow Bot`,
                        creatorId: `${interaction.guild.members.me.id}`,
                        enabled: true,
                        eventType: 1,
                        triggerType: 1,
                        triggerMetadata:
                            {
                                keywordFilter: [`${word}`]
                            },
                        actions: [
                            {
                                type: 1,
                                metadata: {
                                    channel: interaction.channel,
                                    durationSeconds: 10,
                                    customMessage: 'This message was prevented by Hollow Bot'
                                }
                            }
                        ]
                    })
    
                    setTimeout(async () =>{
                        if (!rule4) return;
                        const embed4 = new EmbedBuilder()
                            .setColor('Blue')
                            .setDescription(`:white_check_mark: Your automod rule has been created. All messages containing the word ${word} will be deleted`)
    
                        await interaction.editReply({embeds: [embed4]})
                    }, 3000)
    
                    break;

        }
    }
}