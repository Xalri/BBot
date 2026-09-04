const packageJSON = require("./package.json");
const discordJSVersion = packageJSON.dependencies["discord.js"];
console.log(discordJSVersion);
const Discord = require("discord.js");
const config = require("./config");
const bot = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((a)=>{
        return Discord.GatewayIntentBits[a]
      }),
    shards: [0],
    shardCount: 1,
    autoFetch: [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
    ],
    partials: [
        Discord.Partials.Reaction,
        Discord.Partials.Message,
        Discord.Partials.Channel,
    ]
    
});

const load_commands = require("./loaders/load_commands.js");
const load_event = require("./loaders/load_events.js");

global.modMail = []











bot.commands = new Discord.Collection();
bot.color = "#000000";




load_commands(bot);
load_event(bot);


const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await bot.destroy();
    console.log('Bot has shut down.');
    process.exit(0);
};


process.on('exit', shutdown);
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    shutdown();
});




    



bot.on('error', console.log)


bot.login(config.token);




// while(typeof(command_channel) !== "string" && typeof(welcome_channel) !== "string"){
//     continue
// }

// console.log("channels ok")
