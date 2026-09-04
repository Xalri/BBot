require('dotenv').config();

const readEnv = (name) => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
};

module.exports = {
	token: readEnv('DISCORD_TOKEN'),
	clientId: readEnv('DISCORD_CLIENT_ID'),
	guildId: readEnv('DISCORD_GUILD_ID'),
	tiktokUsername: readEnv('TIKTOK_USERNAME'),
};