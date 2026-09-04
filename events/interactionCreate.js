const config = require("../config")
const { Events, InteractionType, PermissionFlagsBits, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const { createTranscript } = require('discord-html-transcripts')




const sleep = (ms) => { 

    return new Promise(resolve => 

        setTimeout(resolve, ms)

        );

  }

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if(!interaction.guild) return;
		if(interaction.type === InteractionType.ApplicationCommand){
		
		
		
		

        
			let bypassCommandChannel = false

			let commandFile ;
			
			
			
			const foldersPath = path.join(path.join(__dirname, "../"), 'commands');
			const commandFolders = fs.readdirSync(foldersPath);

			let responseMessage = '';
			for(const option of interaction.options.data){
				if (option.type === 6) {
					try {
						const member = await interaction.guild.members.fetch(option.value);
						responseMessage += ` | ${option.name}: ${member.user.tag} (${member.displayName})`;
					} catch (error) {
						console.error(`Error fetching user with value ${option.value}:`, error);
						responseMessage += ` | ${option.name}: Error fetching user`;
					}
				} else {
					responseMessage += ` | ${option.name}: ${option.value}`;
				}				
			};
			
			for (const folder of commandFolders) {
				const commandsPath = path.join(foldersPath, folder);  
				const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					if((interaction.commandName + ".js").toString()  === file.toString()){
						commandFile = require(`../commands/${folder}/${file}`)
						if(folder.toString() === "moderation"){
							bypassCommandChannel = true
							if (!interaction.member.roles.cache.some(role => role.name === '🛠️｜Moderator' && role.name == '🎖️｜Owner')) {
								
								process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${interaction.channel.name}] ${interaction.user.username}: `);
								console.log('\x1b[34m%s\x1b[0m', `${interaction.commandName} ${responseMessage}`);
		
								return interaction.reply({
									content: "You don't have permission to use this command.",
									ephemeral: true  
								});
							}
						}else if(folder.toString() === "owner"){
							bypassCommandChannel = true
							if (!interaction.member.roles.cache.some(role => role.name === '🎖️｜Owner')) {
								
								process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${interaction.channel.name}] ${interaction.user.username}: `);
								console.log('\x1b[34m%s\x1b[0m', `${interaction.commandName} ${responseMessage}`);
		
								return interaction.reply({
									content: "You don't have permission to use this command.",
									ephemeral: true  
								});
							}
							
						
						}else if(folder.toString() === "bot owner only"){
							bypassCommandChannel = true
							if (interaction.user.tag !== 'xalri') {
								
								return interaction.reply({
									content: "You don't have permission to use this command.",
									ephemeral: true  
								});
							}
							
						
						}
						
					}
					
				}
			}
			
			commandinfo = commandFile.info ? commandFile.info : {channel : "command"}


			
			
			
			
			
			
			process.stdout.write(`[${new Date().toLocaleTimeString('fr-FR', {timeZone: "Europe/Paris"})}][${interaction.channel.name}] ${interaction.user.username}: `);
			console.log('\x1b[34m%s\x1b[0m', `${interaction.commandName} ${responseMessage}`);

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			execute_command(command, interaction, responseMessage)

		}else if(interaction.isButton()){
			const { customId } = interaction;
			const type = customId.split('-')[1];
			const userId = interaction.user.id

			if (customId === 'close-ticket') {
				let fetched = {size: 100}
				while(fetched.size === 100){
					fetched = await interaction.channel.messages.fetch({ limit: 100 });
				}
				const ticketCreator = fetched.last().mentions.members.first()
				// Replace close ticket button with confirmation buttons
				const confirmationRow = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('confirm_close')
						.setLabel('Yes')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId('cancel_close')
						.setLabel('No')
						.setStyle(ButtonStyle.Danger)
				);
	
				const confirmationEmbed = new EmbedBuilder()
					.setColor('#ff0000')
					.setTitle('Confirm Close Ticket')
					.setDescription('Are you sure you want to close this ticket?');
	
				await interaction.update({
					content: `Hello <@${ticketCreator.id}>`,
					embeds: [confirmationEmbed],
					components: [confirmationRow],
				});
			}else if (customId === 'confirm_close') {
				let fetched = {size: 100}
				while(fetched.size === 100){
					fetched = await interaction.channel.messages.fetch({ limit: 100 });
				}
				const ticketCreator = fetched.last().mentions.members.first()
				await interaction.channel.permissionOverwrites.delete(ticketCreator.id);
				const closeButton = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('close-ticket')
						.setLabel('Close Ticket')
						.setStyle(ButtonStyle.Danger)
				);
	
				const originalEmbed = new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle('Support Ticket')
					.setDescription(`Ticket Type: ${type}`);
	
				await interaction.update({
					content: `Hello <@${ticketCreator.id}>`,
					embeds: [originalEmbed],
					components: [closeButton],
				});
				const date = new Date().getTime()
				console.log(parseInt(String(date).slice(0, -3)))

				const attachement = await createTranscript(interaction.channel, {
					limit: -1,
					returnBuffer: false,
					filename: `${interaction.channel.name.toLowerCase()}-trasncript.html`
				})

				const embed = new EmbedBuilder()
					.setTitle('Ticket closed')
					.addFields(
						{name: `Opened by`, value: `<@${ticketCreator.id}>`, inline: true},
						{name: 'Closed by', value: `${interaction.user.tag}`, inline: true},
						{name:'Closed', value: `<t:${parseInt(String(date).slice(0, -3))}:R>`}
					)
					.setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})

				
				const url = await ticketCreator.send({files: [attachement]})
				const button = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
						.setLabel('Open')
						.setURL(`https://mahto.id/chat-exporter?url=${url.attachments.first()?.url}`)
						.setStyle(ButtonStyle.Link),

						new ButtonBuilder()
						.setLabel('Download')
						.setURL(`${url.attachments.first()?.url}`)
						.setStyle(ButtonStyle.Link)
					)
				await ticketCreator.send({embeds: [embed], components: [button]})
				const deleteEmbed = new EmbedBuilder()
					.setDescription('\`\`\`ticket controls\`\`\`');
				const deleteButton = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setLabel('Transcript')
							.setCustomId('transcript')
							.setStyle(ButtonStyle.Secondary),

						new ButtonBuilder()
							.setLabel('Re open')
							.setCustomId('re-open')
							.setStyle(ButtonStyle.Secondary),

						new ButtonBuilder()
							.setLabel('Close')
							.setCustomId('delete')
							.setStyle(ButtonStyle.Secondary)
						)
                await interaction.channel.send({embeds: [deleteEmbed], components: [deleteButton]});

			}else if (customId === 'cancel_close') {
				let fetched = {size: 100}
				while(fetched.size === 100){
					fetched = await interaction.channel.messages.fetch({ limit: 100 });
				}
				const ticketCreator = fetched.last().mentions.members.first()
				// Remove confirmation buttons and revert to original state
				const closeButton = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('close-ticket')
						.setLabel('Close Ticket')
						.setStyle(ButtonStyle.Danger)
				);
	
				const originalEmbed = new EmbedBuilder()
					.setColor('#0099ff')
					.setTitle('Support Ticket')
					.setDescription(`Ticket Type: ${type}`);
	
				await interaction.update({
					content: `Hello <@${ticketCreator.id}>`,
					embeds: [originalEmbed],
					components: [closeButton],
				});
			}else if (customId === 'poll'){
				const modal = new ModalBuilder()
					.setCustomId('myModal')
					.setTitle('My Modal');

				// Add components to modal

				// Create the text input components
				const answer = new TextInputBuilder()
					.setCustomId('answer')
					// The label is the prompt the user sees for this input
					.setLabel("Answer :")
					// Short means only a single line of text
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setPlaceholder('Write your answer here !')


				// An action row only holds one text input,
				// so you need one action row per text input.
				const firstActionRow = new ActionRowBuilder().addComponents(answer);

				// Add inputs to the modal
				modal.addComponents(firstActionRow);

				await interaction.showModal(modal)
			}else if (customId.startsWith('autorole-')) {
				let rolename = customId.split('-')[1];
				console.log(rolename)
				
				switch(rolename) {
					case 'announcement':
						rolename = "📢｜Notif Announcements"
						break;
					case 'sneak_peak':
						rolename = "👀｜Notif Sneak Peek"
						break;
					case 'giveaway':
						rolename = "🎁｜Notif Giveaways"
						break;
					case 'event':
						rolename = "📅｜Notif Events"
						break;
					case 'stream':
						rolename = "🎬｜Notif Streams"
						break;
				}
				const role = interaction.guild.roles.cache.find(role => role.name === rolename);
				if(interaction.member.roles.cache.has(role.id)){
					interaction.member.roles.remove(role)
					interaction.reply({content: `Role <@&${role.id}> removed successfully`, ephemeral:true})
				}else{
					interaction.member.roles.add(role)
					interaction.reply({content: `Role <@&${role.id}> added successfully`, ephemeral:true})
				}
			}else if (customId === 'transcript'){
				const attachement = await createTranscript(interaction.channel, {
					limit: -1,
					returnBuffer: false,
					filename: `${interaction.channel.name.toLowerCase()}-trasncript.html`
				})
				const url = await interaction.channel.send({files: [attachement]})
				const button = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
						.setLabel('Open')
						.setURL(`https://mahto.id/chat-exporter?url=${url.attachments.first()?.url}`)
						.setStyle(ButtonStyle.Link),

						new ButtonBuilder()
						.setLabel('Download')
						.setURL(`${url.attachments.first()?.url}`)
						.setStyle(ButtonStyle.Link)
					)
				const embed = new EmbedBuilder()
					.setDescription('\`\`\`Transcript\`\`\`')
				await interaction.channel.send({embeds: [embed], components: [button]})
				await interaction.reply({content: "Transcript generated", ephemeral: true})
			}else if (customId == 're-open') {
				let fetched = {size: 100}
				while(fetched.size === 100){
					fetched = await interaction.channel.messages.fetch({ limit: 100 });
				}
				const ticketCreator = fetched.last().mentions.members.first()
				const ticketMessage = fetched.last()
				interaction.channel.messages.fetch({
					limit: 100 // Change `100` to however many messages you want to fetch
				}).then((messages) => { 
					const botMessages = [];
					messages.filter(m => m.author.id === interaction.guild.members.me.id && m.id !== ticketMessage.id).forEach(msg => botMessages.push(msg))
					interaction.channel.bulkDelete(botMessages).then(() => {
						interaction.channel.send("Cleared bot messages").then(msg => msg.delete({
							timeout: 300
						}))
					});
				})
				interaction.channel.permissionOverwrites.create(ticketCreator, {
					SendMessages: true,
					ViewChannel: true
				})
				const embed = new EmbedBuilder()
					.setTitle("Ticket Re-open")
					.setDescription(`Hey ${ticketCreator}\nYour ticket was reopend by <@${interaction.member.id}>`)
					.setTimestamp();
				interaction.channel.send({ embeds: [embed] })
				interaction.reply({content: "Ticker re open", ephemeral: true})
			}else if (customId == 'delete'){
				interaction.channel.delete()
			}else if (customId == 'button'){
				username = interaction.channel.name
				member = await interaction.guild.members.cache.find(m => m.user.tag === username)
				await interaction.channel.delete()
                member.send(`Your modmail conversation in ${interaction.guild.name} has been closed by a moderator`)
			}

		}else if(interaction.isModalSubmit()){
			if (interaction.customId === 'myModal') {
				if(global.pollAnswers.filter(answer => answer.author === interaction.user.tag).length === 3){
					await interaction.reply({ content: 'You can\'t add more than 3 answer per poll ', ephemeral: true });
				}
				global.pollAnswers.push({answer: interaction.fields.getTextInputValue('answer'), author: interaction.user.tag})
				await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
			}
		}else if (interaction.isStringSelectMenu()){
			const userId = interaction.user.id
			if(interaction.customId === 'ticket'){
				const selectedOption = interaction.values[0]

				let Category;
				let name;
				switch(selectedOption){
					case "purchasing":
						name = "💰｜Purchasing"
                        break;
                    case "questions":
						name = "❓｜Questions"
                        break;
					case "support":
						name = "🛠｜Support"
                        break;
					case "reporting":
						name = "⚠｜Reporting"
                        break;
					case "advertising":
						name = "🚨｜Adversity"
                        break;
					case "partners":
						name = "🤝｜Partners"
                        break;
					case "recruitment":
						name = "🧑💻｜Recruitment"
                        break;
					

				}
				Category = interaction.guild.channels.cache.find(channel => channel.name === name && channel.type === ChannelType.GuildCategory);
				if(!Category){
					Category = await interaction.guild.channels.create(name, { type: ChannelType.GuildCategory });
				}

				const channels = Category.children.valueOf();
				console.log(channels)

				const channelNames = channels.map(channel => channel.name);

				let number = 0

				channelNames.forEach((name) =>{
					if(name.split('-')[1] > number) number = parseInt(name.split('-')[1]) + 1
				})



				const ticketChannel = await interaction.guild.channels.create({
					name: `ticket-${parseInt(('000' + number.toString()).slice(('000' + number.toString()).length-3, ('000' + number.toString()).length))}`,
					type: ChannelType.GuildText,
					parent: `${Category.id}`,
					permissionOverwrites: [
						{
							id: interaction.guild.roles.everyone.id,
							deny: [PermissionFlagsBits.ViewChannel],
						},
						{
							id: userId,
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
						},
						{
							id: `${interaction.guild.roles.cache.find(role => role.name === "ticket access").id}`, // Replace with your support role ID
							deny: [PermissionFlagsBits.ViewChannel],
						},
					],
					parent: Category.id
				});

				

				const closeButton = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('close-ticket')
						.setLabel('Close Ticket')
						.setStyle(ButtonStyle.Danger)
				);
	
				await ticketChannel.send({
					content: `Hello <@${userId}>`,
					embeds: [new EmbedBuilder().setColor('#0099ff').setTitle(`New Ticket by ${interaction.user.username}`).setTimestamp().setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})],
					components: [closeButton],
				});
	
				await interaction.reply({ content: `Your ticket has been created: <#${ticketChannel.id}>`, ephemeral: true });
			}
		}
		
		
		
		
		
		
		
		
	},
};




async function execute_command(command, interaction, responseMessage){
	try {
    			
		if(responseMessage === undefined){responseMessage = "";}
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}