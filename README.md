# TopHeroes Guild Discord Bot

A comprehensive Discord bot for **Top Heroes: Kingdom Saga** guilds with 30+ language translation, game codes, member management, recruitment, and more!

## 🎮 Game Information

- **Game:** Top Heroes: Kingdom Saga
- **Developer:** River Game HK Limited
- **Official Discord:** https://discord.gg/topheroes
- **Website:** https://www.rivergame.net/topheroes/en/home.html

## ✨ Features

### 🌐 Multi-Language Translation (30+ Languages!)
React to any message with a flag emoji to instantly translate:

**Asian Languages:**
- 🇻🇳 Vietnamese | 🇹🇭 Thai | 🇰🇷 Korean | 🇯🇵 Japanese
- 🇨🇳 Chinese (Simplified) | 🇹🇼 Chinese (Traditional)
- 🇮🇩 Indonesian | 🇲🇾 Malay | 🇵🇭 Filipino | 🇮🇳 Hindi | 🇲🇲 Myanmar

**European Languages:**
- 🇺🇸🇬🇧 English | 🇪🇸 Spanish | 🇫🇷 French | 🇩🇪 German
- 🇮🇹 Italian | 🇵🇹🇧🇷 Portuguese | 🇷🇺 Russian | 🇵🇱 Polish
- 🇳🇱 Dutch | 🇹🇷 Turkish | 🇬🇷 Greek | 🇺🇦 Ukrainian
- 🇷🇴 Romanian | 🇨🇿 Czech | 🇸🇪 Swedish | 🇳🇴 Norwegian
- 🇩🇰 Danish | 🇫🇮 Finnish | 🇭🇺 Hungarian

**Middle Eastern:**
- 🇸🇦 Arabic | 🇮🇱 Hebrew | 🇮🇷 Persian

### 🎁 Game Codes System
- `/codes` - View all active codes with redemption instructions
- `/allcodes` - View complete code history (active + expired)
- `/addcode` - Add new codes (Admin/Mod)
- `/redeem` - Step-by-step redemption guide
- Built-in database of known working codes
- Auto-posts to game-codes channel

### 👤 Member Management
- `/register <ign>` - Register your in-game name
- `/updateign <ign>` - Update your IGN
- `/profile [member]` - View member profiles
- `/roster` - View complete guild roster

### 📝 Recruitment System
- `/apply` - Submit application with modal form
- `/applications` - Review pending applications (Admin)
- Approve/Reject with buttons
- Auto-assigns Recruit role

### 💡 Tips & Game Info
- `/tips` - Get random game tips
- `/addtip <tip>` - Add new tips
- `/gameinfo` - Game information & useful links

### 🛡️ Admin Tools
- `/setup` - Auto-create all channels and roles
- `/kick <member> [reason]` - Remove member
- `/inactive [days]` - List inactive members
- `/announce <message> [ping]` - Make announcements
- Daily inactive member reports (30+ days)

### 📊 Auto-Created Server Structure

**Channels:**
- 📢 INFORMATION: welcome, rules, announcements, game-news, game-codes, tips-and-tricks
- 💬 COMMUNITY: general-chat, translations, help, screenshots
- 🎮 GUILD: roster, recruitment, team-finder
- 🔊 VOICE: Gaming, Hangout, AFK
- 🔒 ADMIN: mod-log, admin-chat

**Roles:**
- Guild Master (Gold)
- Officer (Silver)
- Veteran (Bronze)
- Member (Blue)
- Recruit (Gray)

## 🚀 Installation

### Prerequisites
- Node.js 18 or higher
- npm

### Steps

1. **Extract the bot files** to a folder

2. **Install dependencies:**
   ```bash
   cd topheroes-bot
   npm install
   ```

3. **Configure the bot:**
   The `.env` file is already configured with your credentials!

4. **Start the bot:**
   ```bash
   npm start
   ```

## 🎯 First Time Setup

1. Start the bot
2. Go to your Discord server
3. Type `/setup` in any channel
4. Bot creates all channels and roles automatically!
5. Use `/help` to see all commands

## 📋 Commands Reference

### Everyone Can Use:
| Command | Description |
|---------|-------------|
| `/register <ign>` | Register your in-game name |
| `/updateign <ign>` | Update your IGN |
| `/profile [member]` | View profile |
| `/roster` | View guild roster |
| `/apply` | Apply to join guild |
| `/codes` | View active game codes |
| `/allcodes` | View all known codes |
| `/redeem` | How to redeem codes |
| `/tips` | Get a game tip |
| `/gameinfo` | Game info & links |
| `/translate <text> <lang>` | Translate text |
| `/languages` | Show supported languages |
| `/help` | Show all commands |

### Admin/Mod Only:
| Command | Description |
|---------|-------------|
| `/setup` | Create channels/roles |
| `/addcode` | Add game code |
| `/addtip` | Add game tip |
| `/applications` | View applications |
| `/inactive [days]` | List inactive members |
| `/kick <member>` | Remove member |
| `/announce <msg>` | Make announcement |

## 🔗 Code Sources

The bot includes codes from these sources:
- [Pro Game Guides](https://progameguides.com/top-heroes/top-heroes-codes/)
- [Pocket Gamer](https://www.pocketgamer.com/top-heroes/codes/)
- [SuperCheats](https://www.supercheats.com/top-heroes-kingdom-saga-codes)
- [Official Discord](https://discord.gg/topheroes)

## 📁 File Structure

```
topheroes-bot/
├── index.js          # Main bot code
├── package.json      # Dependencies
├── .env              # Configuration (keep secret!)
├── database.json     # Data storage (auto-created)
├── .gitignore        # Git ignore rules
├── start.sh          # Linux/Mac start script
└── README.md         # This file
```

## ⚠️ Security Notes

**IMPORTANT:**
- Never share your `.env` file
- Never commit `.env` to git
- If your token is leaked, reset it immediately in Discord Developer Portal

## 🔧 Troubleshooting

### Bot not responding?
- Check if bot is online in Discord
- Verify intents are enabled in Developer Portal
- Check console for errors

### Commands not showing?
- Wait 1-2 minutes (Discord caches commands)
- Try restarting the bot

### Translation not working?
- Ensure bot can see messages in that channel
- Check internet connection

## 📞 Support

- **Game Support:** support_th@rivergame.net
- **Official Discord:** https://discord.gg/topheroes

---
Made with ❤️ for TopHeroes Guild
