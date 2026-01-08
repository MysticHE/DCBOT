# TopHeroes Guild Bot - Command Reference

Complete documentation for all bot commands, features, and access rights.

---

## Table of Contents

- [Role Hierarchy](#role-hierarchy)
- [Admin Commands](#admin-commands)
- [Moderator Commands](#moderator-commands)
- [Member Commands](#member-commands)
- [Game Info Commands](#game-info-commands)
- [Translation Commands](#translation-commands)
- [Automated Features](#automated-features)
- [Channel Structure](#channel-structure)

---

## Role Hierarchy

| Role | Color | Permissions | Description |
|------|-------|-------------|-------------|
| **R5 \| Guild Master** | Gold | Administrator | Full server control |
| **R4 \| Officer** | Silver | Manage Messages, Kick Members | Moderator duties |
| **R3 \| Veteran** | Bronze | View & Send Messages | Experienced member |
| **R2 \| Member** | Blue | View & Send Messages | Regular member |
| **R1 \| Recruit** | Gray | View & Send Messages | New member (default after approval) |
| **Applicant** | Dark Gray | Limited View | Pending application |

---

## Admin Commands

> **Required Permission:** Administrator (R5 only)

### `/setup`
Setup all bot channels and roles.

- Creates R1-R5 roles + Applicant role
- Removes undefined categories (INFORMATION, etc.)
- Merges duplicate WELCOME categories
- Creates standard channel structure
- Removes unused channels (mod-log, etc.)

**Usage:**
```
/setup
```

---

### `/welcome`
Post the interactive welcome message with Apply button.

- Posts welcome embed in current channel
- Includes "Apply to Join" button
- Shows guild rules and benefits

**Usage:**
```
/welcome
```
> Run this in #welcome channel after `/setup`

---

### `/setign`
Set a member's in-game name and server nickname.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `member` | User | Yes | Member to update |
| `ign` | String | Yes | New in-game name |

**Usage:**
```
/setign @username PlayerName123
```

---

### `/setrank`
Set a member's guild rank.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `member` | User | Yes | Member to update |
| `rank` | Choice | Yes | R1, R2, R3, R4, or R5 |

**Rank Options:**
- `R1` - Recruit (new member)
- `R2` - Member (regular)
- `R3` - Veteran (experienced)
- `R4` - Officer (moderator)
- `R5` - Guild Master (admin)

**Usage:**
```
/setrank @username R3
```

---

### `/kick`
Remove a member from the guild and server.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `member` | User | Yes | Member to remove |
| `reason` | String | No | Reason for removal |

**Usage:**
```
/kick @username Inactivity
```

---

## Moderator Commands

> **Required Permission:** Manage Messages (R4 and R5)

### `/addcode`
Add a new game code to the database.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | String | Yes | The game code |
| `description` | String | Yes | What the code gives |
| `expiry` | String | No | Expiry date (e.g., 2024-12-31) |

**Usage:**
```
/addcode TH2025 "500 Diamonds + 5 Vouchers" 2025-03-31
```
> Posts announcement in #game-codes channel

---

### `/addtip`
Add a new game tip to a category.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | Choice | Yes | event, item, or beginner |
| `tip` | String | Yes | The tip content |

**Categories:**
- `event` - Event timing and strategy tips
- `item` - Item and gear tips
- `beginner` - New player tips

**Usage:**
```
/addtip beginner "Always complete daily quests for maximum rewards!"
```

---

### `/applications`
View and manage pending guild applications.

- Shows list of pending applications
- Select an application to review details
- Approve or Reject with buttons
- Approved members get R1 role + nickname set

**Usage:**
```
/applications
```

---

### `/inactive`
List members inactive for specified days.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `days` | Integer | No | Days of inactivity (default: 14) |

**Usage:**
```
/inactive 30
```

---

## Member Commands

> **Required Permission:** None (all members)

### `/apply`
Apply to join the guild.

Opens a modal form with:
- In-Game Name (IGN)
- Playing experience
- Castle Level
- Why you want to join

**Usage:**
```
/apply
```
> Or click "Apply to Join" button in #welcome

---

### `/profile`
View your or another member's profile.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `member` | User | No | Member to view (default: yourself) |

**Shows:**
- IGN
- Role/Rank
- Join date
- Last active date
- Notes (if any)

**Usage:**
```
/profile
/profile @username
```

---

### `/roster`
View the full guild roster.

- Lists all registered members
- Grouped by role/rank
- Shows IGN and Discord mention

**Usage:**
```
/roster
```

---

### `/codes`
View all active game codes.

- Shows known working codes
- Shows community-submitted codes
- Includes code sources links

**Usage:**
```
/codes
```

---

### `/allcodes`
View ALL known codes (active + expired).

- Complete code history
- Expired codes for reference
- Tip: expired codes sometimes reactivate!

**Usage:**
```
/allcodes
```

---

### `/tips`
Get a random game tip from a category.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | Choice | No | event, item, or beginner |

**Usage:**
```
/tips
/tips beginner
/tips event
```

---

### `/help`
Show all available commands.

- Categorized command list
- Brief descriptions
- Permission indicators

**Usage:**
```
/help
```

---

## Game Info Commands

> **Required Permission:** None (all members)

### `/gameinfo`
Show Top Heroes game information.

**Displays:**
- Game name and developer
- Supported platforms
- Official website link
- Official Discord link
- Support email
- Code source websites

**Usage:**
```
/gameinfo
```

---

### `/redeem`
Show step-by-step guide to redeem codes in-game.

**Steps:**
1. Launch Top Heroes
2. Tap Avatar icon (top-left)
3. Tap Settings
4. Tap Gift Code
5. Enter code
6. Tap Confirm

**Important Notes:**
- Codes are case-sensitive
- Most require Castle Level 10+
- One-time use per account

**Usage:**
```
/redeem
```

---

## Translation Commands

> **Required Permission:** None (all members)

### `/translate`
Translate text to another language.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | String | Yes | Text to translate |
| `to` | Choice | Yes | Target language |

**Supported Languages (25 choices):**
Vietnamese, Thai, Korean, Japanese, Chinese (Simplified), Chinese (Traditional), Indonesian, Malay, Filipino, Hindi, English, Spanish, French, German, Italian, Portuguese, Russian, Polish, Turkish, Arabic, Dutch, Ukrainian, Greek, Swedish, Romanian

**Usage:**
```
/translate "Hello, how are you?" vi
```

---

### `/languages`
Show all supported languages and flag emojis.

**Supports 35+ languages via flag reactions:**

| Region | Flags |
|--------|-------|
| Asian | 🇻🇳 🇹🇭 🇰🇷 🇯🇵 🇨🇳 🇹🇼 🇮🇩 🇲🇾 🇵🇭 🇮🇳 🇲🇲 |
| European | 🇺🇸 🇬🇧 🇪🇸 🇫🇷 🇩🇪 🇮🇹 🇵🇹 🇧🇷 🇷🇺 🇵🇱 🇳🇱 🇹🇷 🇬🇷 🇺🇦 🇷🇴 🇨🇿 🇸🇪 🇳🇴 🇩🇰 🇫🇮 🇭🇺 |
| Middle East | 🇸🇦 🇮🇱 🇮🇷 |

**Usage:**
```
/languages
```

---

## Automated Features

### Flag Reaction Translation
React to any message with a country flag emoji to auto-translate.

**How it works:**
1. Someone posts a message
2. React with a flag emoji (e.g., 🇻🇳)
3. Bot replies with translation

---

### Activity Tracking
Bot automatically tracks member activity.

- Records last message timestamp
- Counts total messages
- Updates on every message sent

---

### New Member Welcome
When someone joins the server:

1. Auto-assigns "Applicant" role
2. Sends welcome DM with instructions
3. Directs to #welcome channel

---

### Application System

**Flow:**
1. User clicks "Apply to Join" or uses `/apply`
2. Modal form appears (IGN, experience, castle level, why join)
3. Application posted to #applications channel
4. Admin clicks Approve/Reject
5. If approved:
   - User gets R1 role
   - Nickname set to IGN
   - Applicant role removed
   - Welcome DM sent

---

### Scheduled Tasks

| Task | Schedule | Description |
|------|----------|-------------|
| Inactive Check | Daily 9 AM | Logs members inactive 30+ days |
| Code Check | Every 6 hours | Placeholder for code scraping |

---

## Channel Structure

After running `/setup`, your server will have:

```
🔒 ADMIN (R5/R4)
├── 💼admin-chat
└── 📝applications

🏰 WELCOME
└── 👋welcome

💬 COMMUNITY
├── 💬general-chat
├── 🌐translations
└── 📷screenshots

🔊 VOICE
├── 🎮 Gaming
└── 💬 Hangout

💡 TIPS & TRICKS
├── 🎁game-codes
├── 📅event-guides
├── 🎒item-guides
└── 🌟beginner-guides
```

### Channel Permissions

| Category | Visible To | Can Send |
|----------|------------|----------|
| ADMIN | R4, R5 only | R4, R5 |
| WELCOME | Everyone | No one (read-only) |
| COMMUNITY | R1-R5 members | R1-R5 members |
| VOICE | R1-R5 members | R1-R5 members |
| TIPS & TRICKS | R1-R5 members | R1-R5 members |

---

## Quick Reference

### For Admins (R5)
```
/setup          - Initial server setup
/welcome        - Post welcome message
/setign         - Set member IGN
/setrank        - Promote/demote member
/kick           - Remove member
/applications   - Manage applications
/inactive       - Check inactive members
/addcode        - Add game code
/addtip         - Add game tip
```

### For Officers (R4)
```
/applications   - Manage applications
/inactive       - Check inactive members
/addcode        - Add game code
/addtip         - Add game tip
```

### For All Members (R1-R5)
```
/apply          - Join guild
/profile        - View profile
/roster         - View members
/codes          - View codes
/allcodes       - All codes history
/tips           - Get game tips
/translate      - Translate text
/languages      - Show languages
/gameinfo       - Game info
/redeem         - How to redeem
/help           - Command help
```

---

*Last updated: January 2026*
*TopHeroes Guild Bot v1.0*
