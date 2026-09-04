# Discord Bot

A Discord bot built with `discord.js` for moderation, automation, and guild utilities.

## Features

- Slash command registration and automatic command loading from the `commands/` folder
- Moderation tools for banning, kicking, muting, unmuting, temp banning, temp muting, locking, unlocking, and slowmode control
- Cleanup and chat management commands such as purge, clear channel, and say
- Server setup and utility commands for automod, invites, polls, and giveaways
- Message-driven automation for mod mail, embed logging, ticket-style interactions, and reaction handling
- Member lifecycle events for join, leave, voice state changes, and ready-time startup tasks
- Optional social posting support for YouTube and TikTok checks in the ready event

## Requirements

- Node.js 18 or newer
- A Discord application and bot token
- A `.env` file in the project root

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
copy .env.example .env
```

3. Fill in the required values:

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_application_client_id
DISCORD_GUILD_ID=your_guild_id
TIKTOK_USERNAME=your_tiktok_username
```

## Running

Start the bot:

```bash
node index.js
```

Deploy slash commands:

```bash
node deploy_commands.js
```

## Configuration

The bot reads its configuration from environment variables through `config.js`.

- `DISCORD_TOKEN` is required for login and command deployment
- `DISCORD_CLIENT_ID` is required for slash command registration
- `DISCORD_GUILD_ID` is required by guild-specific features
- `TIKTOK_USERNAME` is required by the TikTok posting logic in `events/ready.js`

## Project Structure

- `index.js` starts the bot
- `deploy_commands.js` registers slash commands
- `commands/` contains slash command handlers
- `events/` contains Discord event listeners
- `loaders/` loads commands and events
