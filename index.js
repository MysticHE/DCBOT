require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ChannelType, Partials } = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Initialize Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences
    ],
    partials: [
        Partials.Message,
        Partials.Reaction,
        Partials.Channel
    ]
});

// ============================================
// GAME INFO - TOP HEROES: KINGDOM SAGA
// ============================================
const GAME_INFO = {
    name: 'Top Heroes: Kingdom Saga',
    developer: 'River Game HK Limited',
    discord: 'https://discord.gg/topheroes',
    website: 'https://www.rivergame.net/topheroes/en/home.html',
    support: 'support_th@rivergame.net',
    codesSources: [
        'https://progameguides.com/top-heroes/top-heroes-codes/',
        'https://www.pocketgamer.com/top-heroes/codes/',
        'https://www.supercheats.com/top-heroes-kingdom-saga-codes'
    ]
};

// ============================================
// JSON DATABASE HELPER
// ============================================
const DB_PATH = path.join(__dirname, 'database.json');

function loadDatabase() {
    try {
        if (fs.existsSync(DB_PATH)) {
            return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading database:', error);
    }
    return {
        members: {},
        applications: [],
        gameCodes: [],
        activity: {},
        tips: {
            event: [
                "📅 Always check event timers - most events reset at server midnight!",
                "📅 Save stamina potions for double-reward event days!",
                "📅 Guild events give better rewards - coordinate with guildmates!",
                "📅 Limited-time events often have exclusive heroes - prioritize them!",
                "📅 Event shops usually have better value than regular purchases!"
            ],
            item: [
                "🎒 Focus on upgrading legendary gear over epic - better long-term value!",
                "🎒 Save your universal hero shards for S-tier heroes only!",
                "🎒 Don't waste gold on common item upgrades - save for legendaries!",
                "🎒 Artifact sets provide huge bonuses - complete sets before mixing!",
                "🎒 Weekly shop resets have the best gem-to-value ratios!"
            ],
            beginner: [
                "🌟 Complete your daily quests every day for maximum rewards!",
                "🌟 Focus on S-tier heroes: Ne Zha, Pyromancer, Astrologer!",
                "🌟 Castle level limits hero level - upgrade your castle first!",
                "🌟 Adjudicator is the best tank - prioritize getting him!",
                "🌟 Complete the tutorial fully before free roaming to avoid bugs!",
                "🌟 Check gift codes in Settings > Gift Code in-game!",
                "🌟 Most codes require Castle level 10+ to redeem!",
                "🌟 Join guild activities for bonus experience and items!",
                "🌟 Save Diamonds for hero summons during special events!"
            ]
        },
        lastCodeCheck: null
    };
}

function saveDatabase(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

let db = loadDatabase();

// ============================================
// LANGUAGE CONFIGURATION - ALL COMMON LANGUAGES
// Game supports 17 languages, we support even more!
// ============================================
const languageFlags = {
    // Asian Languages
    '🇻🇳': 'vi',      // Vietnamese
    '🇹🇭': 'th',      // Thai
    '🇰🇷': 'ko',      // Korean
    '🇯🇵': 'ja',      // Japanese
    '🇨🇳': 'zh-CN',   // Chinese (Simplified)
    '🇹🇼': 'zh-TW',   // Chinese (Traditional)
    '🇮🇩': 'id',      // Indonesian
    '🇲🇾': 'ms',      // Malay
    '🇵🇭': 'tl',      // Filipino/Tagalog
    '🇮🇳': 'hi',      // Hindi
    '🇲🇲': 'my',      // Myanmar/Burmese
    
    // European Languages
    '🇺🇸': 'en',      // English (US)
    '🇬🇧': 'en',      // English (UK)
    '🇪🇸': 'es',      // Spanish
    '🇫🇷': 'fr',      // French
    '🇩🇪': 'de',      // German
    '🇮🇹': 'it',      // Italian
    '🇵🇹': 'pt',      // Portuguese
    '🇧🇷': 'pt',      // Portuguese (Brazil)
    '🇷🇺': 'ru',      // Russian
    '🇵🇱': 'pl',      // Polish
    '🇳🇱': 'nl',      // Dutch
    '🇹🇷': 'tr',      // Turkish
    '🇬🇷': 'el',      // Greek
    '🇺🇦': 'uk',      // Ukrainian
    '🇷🇴': 'ro',      // Romanian
    '🇨🇿': 'cs',      // Czech
    '🇸🇪': 'sv',      // Swedish
    '🇳🇴': 'no',      // Norwegian
    '🇩🇰': 'da',      // Danish
    '🇫🇮': 'fi',      // Finnish
    '🇭🇺': 'hu',      // Hungarian
    
    // Middle Eastern Languages
    '🇸🇦': 'ar',      // Arabic
    '🇮🇱': 'he',      // Hebrew
    '🇮🇷': 'fa',      // Persian/Farsi
};

const languageNames = {
    'vi': 'Vietnamese 🇻🇳',
    'th': 'Thai 🇹🇭',
    'ko': 'Korean 🇰🇷',
    'ja': 'Japanese 🇯🇵',
    'zh-CN': 'Chinese (Simplified) 🇨🇳',
    'zh-TW': 'Chinese (Traditional) 🇹🇼',
    'id': 'Indonesian 🇮🇩',
    'ms': 'Malay 🇲🇾',
    'tl': 'Filipino 🇵🇭',
    'hi': 'Hindi 🇮🇳',
    'my': 'Myanmar 🇲🇲',
    'en': 'English 🇺🇸',
    'es': 'Spanish 🇪🇸',
    'fr': 'French 🇫🇷',
    'de': 'German 🇩🇪',
    'it': 'Italian 🇮🇹',
    'pt': 'Portuguese 🇵🇹',
    'ru': 'Russian 🇷🇺',
    'pl': 'Polish 🇵🇱',
    'nl': 'Dutch 🇳🇱',
    'tr': 'Turkish 🇹🇷',
    'el': 'Greek 🇬🇷',
    'uk': 'Ukrainian 🇺🇦',
    'ro': 'Romanian 🇷🇴',
    'cs': 'Czech 🇨🇿',
    'sv': 'Swedish 🇸🇪',
    'no': 'Norwegian 🇳🇴',
    'da': 'Danish 🇩🇰',
    'fi': 'Finnish 🇫🇮',
    'hu': 'Hungarian 🇭🇺',
    'ar': 'Arabic 🇸🇦',
    'he': 'Hebrew 🇮🇱',
    'fa': 'Persian 🇮🇷'
};

// Language choices for slash commands (Discord limit: 25 choices)
const languageChoices = [
    { name: '🇻🇳 Vietnamese', value: 'vi' },
    { name: '🇹🇭 Thai', value: 'th' },
    { name: '🇰🇷 Korean', value: 'ko' },
    { name: '🇯🇵 Japanese', value: 'ja' },
    { name: '🇨🇳 Chinese (Simplified)', value: 'zh-CN' },
    { name: '🇹🇼 Chinese (Traditional)', value: 'zh-TW' },
    { name: '🇮🇩 Indonesian', value: 'id' },
    { name: '🇲🇾 Malay', value: 'ms' },
    { name: '🇵🇭 Filipino', value: 'tl' },
    { name: '🇮🇳 Hindi', value: 'hi' },
    { name: '🇺🇸 English', value: 'en' },
    { name: '🇪🇸 Spanish', value: 'es' },
    { name: '🇫🇷 French', value: 'fr' },
    { name: '🇩🇪 German', value: 'de' },
    { name: '🇮🇹 Italian', value: 'it' },
    { name: '🇵🇹 Portuguese', value: 'pt' },
    { name: '🇷🇺 Russian', value: 'ru' },
    { name: '🇵🇱 Polish', value: 'pl' },
    { name: '🇹🇷 Turkish', value: 'tr' },
    { name: '🇸🇦 Arabic', value: 'ar' },
    { name: '🇳🇱 Dutch', value: 'nl' },
    { name: '🇺🇦 Ukrainian', value: 'uk' },
    { name: '🇬🇷 Greek', value: 'el' },
    { name: '🇸🇪 Swedish', value: 'sv' },
    { name: '🇷🇴 Romanian', value: 'ro' }
];

// Translation bridge channel names
const BRIDGE_CHANNELS = {
    english: ['💬general-chat', 'general-chat', 'general'],
    languages: [
        { code: 'vi', label: 'Tiếng Việt 🇻🇳', color: 0xDA251D, names: ['vietnamese-chat', 'tiếng-việt', '🇻🇳tiếng-việt'] },
        { code: 'ko', label: '한국어 🇰🇷', color: 0x003478, names: ['korean-chat', '한국어-chat', '🇰🇷korean-chat'] },
        { code: 'ja', label: '日本語 🇯🇵', color: 0xBC002D, names: ['japanese-chat', '日本語-chat', '🇯🇵japanese-chat'] },
        { code: 'zh-CN', label: '中文 🇨🇳', color: 0xDE2910, names: ['chinese-chat', '中文-chat', '🇨🇳chinese-chat'] },
        { code: 'th', label: 'ไทย 🇹🇭', color: 0x2D2A4A, names: ['thai-chat', 'ไทย-chat', '🇹🇭thai-chat'] },
        { code: 'ru', label: 'Русский 🇷🇺', color: 0x0039A6, names: ['russian-chat', 'русский-chat', '🇷🇺russian-chat'] },
        { code: 'uk', label: 'Українська 🇺🇦', color: 0x005BBB, names: ['ukrainian-chat', 'українська-chat', '🇺🇦ukrainian-chat'] },
        { code: 'id', label: 'Indonesia 🇮🇩', color: 0xFF0000, names: ['indonesian-chat', 'indonesia-chat', '🇮🇩indonesian-chat'] }
    ]
};

// Language roles for channel access control
const LANGUAGE_ROLES = {
    'en': { name: 'Lang-English', color: '#3C3B6E', channelNames: [] },
    'vi': { name: 'Lang-Vietnamese', color: '#DA251D', channelNames: ['vietnamese-chat'] },
    'ko': { name: 'Lang-Korean', color: '#003478', channelNames: ['korean-chat'] },
    'ja': { name: 'Lang-Japanese', color: '#BC002D', channelNames: ['japanese-chat'] },
    'zh-CN': { name: 'Lang-Chinese', color: '#DE2910', channelNames: ['chinese-chat'] },
    'th': { name: 'Lang-Thai', color: '#2D2A4A', channelNames: ['thai-chat'] },
    'ru': { name: 'Lang-Russian', color: '#0039A6', channelNames: ['russian-chat'] },
    'uk': { name: 'Lang-Ukrainian', color: '#005BBB', channelNames: ['ukrainian-chat'] },
    'id': { name: 'Lang-Indonesian', color: '#FF0000', channelNames: ['indonesian-chat'] }
};

// Guide channels for DM translations (react with flag → DM instead of reply)
const GUIDE_CHANNELS = [
    // 💡 TIPS & TRICKS
    'tips-and-tricks',
    'game-codes',
    'item-guides',
    'hero-information',
    'queue-comps-and-gear',
    'resource-management',
    'pvp-vs-pve',
    'terms-and-glossary',
    'when-youre-stuck',
    // 📅 Event Guides
    'guild-race',
    'guild-arms-race',
    'kvk',
    'ancient-battlefield',
    'glory-battlefield',
    'frostfield-battle'
];

// ============================================
// SLASH COMMANDS DEFINITION
// ============================================
const commands = [
    {
        name: 'setup',
        description: 'Setup all bot channels and roles (Admin only)',
        default_member_permissions: PermissionFlagsBits.Administrator.toString()
    },
    {
        name: 'welcome',
        description: 'Post the interactive welcome message (Admin only)',
        default_member_permissions: PermissionFlagsBits.Administrator.toString()
    },
    {
        name: 'setign',
        description: 'Set a member\'s IGN and nickname (Admin only)',
        options: [
            { name: 'member', description: 'Member to update', type: 6, required: true },
            { name: 'ign', description: 'New in-game name', type: 3, required: true }
        ],
        default_member_permissions: PermissionFlagsBits.Administrator.toString()
    },
    {
        name: 'addcode',
        description: 'Add a new game code (Admin/Mod only)',
        options: [
            { name: 'code', description: 'The game code', type: 3, required: true },
            { name: 'description', description: 'What the code gives', type: 3, required: true },
            { name: 'expiry', description: 'Expiry date (e.g., 2024-12-31)', type: 3, required: false }
        ],
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString()
    },
    {
        name: 'editcode',
        description: 'Edit an existing game code (Admin/Mod only)',
        options: [
            { name: 'code', description: 'The code to edit', type: 3, required: true },
            { name: 'description', description: 'New description', type: 3, required: false },
            { name: 'status', description: 'Code status', type: 3, required: false, choices: [
                { name: 'Active', value: 'active' },
                { name: 'Expired', value: 'expired' }
            ]}
        ],
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString()
    },
    {
        name: 'removecode',
        description: 'Remove a game code (Admin/Mod only)',
        options: [
            { name: 'code', description: 'The code to remove', type: 3, required: true }
        ],
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString()
    },
    {
        name: 'codes',
        description: 'View all active game codes'
    },
    {
        name: 'allcodes',
        description: 'View ALL known codes (active + expired) for reference'
    },
    {
        name: 'applications',
        description: 'View pending applications (Admin/Mod only)',
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString()
    },
    {
        name: 'kick',
        description: 'Remove a member from the guild (Admin only)',
        options: [
            { name: 'member', description: 'Member to remove', type: 6, required: true },
            { name: 'reason', description: 'Reason for removal', type: 3, required: false }
        ],
        default_member_permissions: PermissionFlagsBits.KickMembers.toString()
    },
    {
        name: 'inactive',
        description: 'List inactive members (Admin/Mod only)',
        options: [{ name: 'days', description: 'Days of inactivity (default: 14)', type: 4, required: false }],
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString()
    },
    {
        name: 'translate',
        description: 'Translate text to another language',
        options: [
            { name: 'text', description: 'Text to translate', type: 3, required: true },
            { name: 'to', description: 'Target language', type: 3, required: true, choices: languageChoices }
        ]
    },
    {
        name: 'languages',
        description: 'Show all supported languages and their flag emojis'
    },
    {
        name: 'help',
        description: 'Show all available commands'
    },
    {
        name: 'gameinfo',
        description: 'Show Top Heroes game information and useful links'
    },
    {
        name: 'redeem',
        description: 'Show how to redeem codes in Top Heroes'
    },
    {
        name: 'setrank',
        description: 'Set a member\'s guild rank (Admin only)',
        options: [
            { name: 'member', description: 'Member to update', type: 6, required: true },
            {
                name: 'rank',
                description: 'New rank',
                type: 3,
                required: true,
                choices: [
                    { name: 'Member', value: 'Member' },
                    { name: 'R4', value: 'R4' },
                    { name: 'Guild Master', value: 'GuildMaster' }
                ]
            }
        ],
        default_member_permissions: PermissionFlagsBits.Administrator.toString()
    },
    {
        name: 'translationguide',
        description: 'Post the translation guide with all supported languages (Admin only)',
        default_member_permissions: PermissionFlagsBits.Administrator.toString()
    },
    {
        name: 'setlanguage',
        description: 'Change your preferred language channel',
        options: [
            {
                name: 'language',
                description: 'Your preferred language',
                type: 3,
                required: true,
                choices: [
                    { name: 'English (general-chat only)', value: 'en' },
                    { name: 'Vietnamese', value: 'vi' },
                    { name: 'Korean', value: 'ko' },
                    { name: 'Japanese', value: 'ja' },
                    { name: 'Chinese', value: 'zh-CN' },
                    { name: 'Thai', value: 'th' },
                    { name: 'Russian', value: 'ru' },
                    { name: 'Ukrainian', value: 'uk' },
                    { name: 'Indonesian', value: 'id' }
                ]
            }
        ]
    },
    {
        name: 'setup-language-channels',
        description: 'Configure language channel permissions (Admin only)',
        default_member_permissions: PermissionFlagsBits.Administrator.toString()
    },
    {
        name: 'adminhelp',
        description: 'Show admin commands for R4 and Guild Master',
        default_member_permissions: PermissionFlagsBits.ManageMessages.toString()
    },
];

// ============================================
// REGISTER SLASH COMMANDS
// ============================================
async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

// ============================================
// BOT READY EVENT
// ============================================
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📊 Serving ${client.guilds.cache.size} server(s)`);
    console.log(`🎮 Game: ${GAME_INFO.name}`);
    client.user.setActivity('Top Heroes | /help', { type: 3 });
    await registerCommands();
    
    // Schedule daily inactive check (9 AM)
    cron.schedule('0 9 * * *', () => checkInactiveMembers());
    
    // Schedule code check every 6 hours
    cron.schedule('0 */6 * * *', () => checkForNewCodes());
});

// ============================================
// TRANSLATION FUNCTION
// ============================================
async function translateText(text, targetLang) {
    try {
        const translate = require('@iamtraction/google-translate');
        const result = await translate(text, { to: targetLang });
        return result.text;
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

// Translation bridge: sends translated message to target channel
async function sendTranslationBridge(message, targetChannel, targetLang, langLabel, color) {
    try {
        const translated = await translateText(message.content, targetLang);
        if (!translated || translated.toLowerCase() === message.content.toLowerCase()) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.author.displayName || message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`**Original:**\n${message.content.slice(0, 500)}\n\n**${langLabel}:**\n${translated.slice(0, 500)}`)
            .setColor(color || 0x0099ff)
            .setFooter({ text: `From #${message.channel.name}` })
            .setTimestamp();

        await targetChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Translation bridge error:', error.message);
    }
}

// ============================================
// MESSAGE REACTION FOR TRANSLATION
// ============================================
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    // Fetch partial reaction and message if needed
    try {
        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();
    } catch (error) {
        console.error('Error fetching reaction/message:', error);
        return;
    }

    const emoji = reaction.emoji.name;
    const targetLang = languageFlags[emoji];

    if (targetLang) {
        const originalMessage = reaction.message;
        if (!originalMessage.content) return;

        // Check if this is a guide channel (DM translations)
        const channelName = originalMessage.channel.name?.toLowerCase() || '';
        const isGuideChannel = GUIDE_CHANNELS.some(guide =>
            channelName.includes(guide.toLowerCase())
        );

        try {
            const translated = await translateText(originalMessage.content, targetLang);

            if (translated) {
                if (isGuideChannel) {
                    // Guide channel: Send DM to user
                    const messageLink = `https://discord.com/channels/${originalMessage.guild?.id}/${originalMessage.channel.id}/${originalMessage.id}`;

                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setAuthor({
                            name: originalMessage.author?.username || 'Unknown',
                            iconURL: originalMessage.author?.displayAvatarURL()
                        })
                        .setDescription(`**Original:**\n${originalMessage.content}\n\n**${languageNames[targetLang]}:**\n${translated}`)
                        .addFields({
                            name: '📍 Source',
                            value: `[#${originalMessage.channel.name}](${messageLink})`,
                            inline: true
                        })
                        .setFooter({ text: `Translated to ${languageNames[targetLang]}` })
                        .setTimestamp();

                    try {
                        await user.send({ embeds: [embed] });
                    } catch (dmError) {
                        console.log(`Could not DM translation to ${user.tag}: DMs disabled`);
                    }
                } else {
                    // Other channels: Reply in channel (existing behavior)
                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setAuthor({
                            name: originalMessage.author?.username || 'Unknown',
                            iconURL: originalMessage.author?.displayAvatarURL()
                        })
                        .setDescription(`**Original:**\n${originalMessage.content}\n\n**${languageNames[targetLang]}:**\n${translated}`)
                        .setFooter({ text: `Translated to ${languageNames[targetLang]}` })
                        .setTimestamp();

                    await originalMessage.reply({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.error('Translation reaction error:', error);
        }
    }
});

// ============================================
// MESSAGE TRACKING FOR ACTIVITY + AUTO-TRANSLATE
// ============================================
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Activity tracking
    const now = new Date().toISOString();
    if (!db.activity[message.author.id]) {
        db.activity[message.author.id] = { lastMessage: now, messageCount: 0 };
    }
    db.activity[message.author.id].lastMessage = now;
    db.activity[message.author.id].messageCount++;

    if (db.members[message.author.id]) {
        db.members[message.author.id].lastActive = now;
    }

    saveDatabase(db);

    // Translation bridge: General ↔ All language channels
    if (message.guild && message.content && message.content.length >= 3) {
        const channelName = message.channel.name.toLowerCase();

        // Check if message is from English general chat
        const isEnglishChannel = channelName.includes('general-chat') || channelName === 'general';

        // Check if message is from any language channel
        const sourceLang = BRIDGE_CHANNELS.languages.find(lang =>
            lang.names.some(name => channelName.includes(name.toLowerCase()))
        );

        if (isEnglishChannel || sourceLang) {
            const bridgeTextOnly = message.content
                .replace(/<@!?\d+>/g, '')
                .replace(/<#\d+>/g, '')
                .replace(/<@&\d+>/g, '')
                .replace(/https?:\/\/\S+/g, '')
                .replace(/:\w+:/g, '')
                .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
                .replace(/[\u{2600}-\u{27BF}]/gu, '')
                .trim();

            if (bridgeTextOnly.length >= 3) {
                if (isEnglishChannel && !sourceLang) {
                    // English → ALL language channels
                    for (const lang of BRIDGE_CHANNELS.languages) {
                        const targetChannel = message.guild.channels.cache.find(ch =>
                            lang.names.some(name => ch.name.toLowerCase().includes(name.toLowerCase()))
                        );
                        if (targetChannel) {
                            sendTranslationBridge(message, targetChannel, lang.code, lang.label, lang.color);
                        }
                    }
                } else if (sourceLang) {
                    // Language channel → English only
                    const enChannel = message.guild.channels.cache.find(ch =>
                        ch.name.toLowerCase().includes('general-chat')
                    );
                    if (enChannel) {
                        sendTranslationBridge(message, enChannel, 'en', 'English 🇺🇸', 0x3C3B6E);
                    }
                }
            }
        }
    }

    // Auto-translate non-English messages to English
    if (!message.content || message.content.length < 3) return;

    // Skip messages that are only emojis, links, mentions, or commands
    const textOnly = message.content
        .replace(/<@!?\d+>/g, '')           // Remove user mentions
        .replace(/<#\d+>/g, '')             // Remove channel mentions
        .replace(/<@&\d+>/g, '')            // Remove role mentions
        .replace(/https?:\/\/\S+/g, '')     // Remove URLs
        .replace(/:\w+:/g, '')              // Remove custom emojis
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
        .replace(/[\u{2600}-\u{27BF}]/gu, '')   // Remove symbols
        .trim();

    // Need at least 3 characters of actual text to translate
    if (textOnly.length < 3) return;

    try {
        const translate = require('@iamtraction/google-translate');
        const result = await translate(message.content, { to: 'en' });

        // Only translate if source language is not English
        const sourceLang = result.from.language.iso;
        if (sourceLang !== 'en' && result.text.toLowerCase() !== message.content.toLowerCase()) {
            const langName = languageNames[sourceLang] || sourceLang.toUpperCase();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setDescription(`**Original (${langName}):**\n${message.content}\n\n**English 🇺🇸:**\n${result.text}`)
                .setFooter({ text: '🌐 Auto-translated to English' })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        }
    } catch (error) {
        // Silently fail - don't spam console for translation errors
        if (error.message && !error.message.includes('Could not translate')) {
            console.error('Auto-translate error:', error.message);
        }
    }
});

// ============================================
// MEMBER JOIN EVENT
// ============================================
client.on('guildMemberAdd', async (member) => {
    // Give Applicant role to new members
    try {
        const applicantRole = member.guild.roles.cache.find(r => r.name === 'Applicant');
        if (applicantRole) await member.roles.add(applicantRole);
    } catch (e) {
        console.log('Could not assign Applicant role:', e.message);
    }

    // No auto-welcome message - welcome is sent to general chat when approved by admin
});

// ============================================
// SLASH COMMAND HANDLER
// ============================================
client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        try {
            await handleButtonInteraction(interaction);
        } catch (error) {
            console.error('Button interaction error:', error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ An error occurred.', ephemeral: true }).catch(() => {});
                } else {
                    await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }).catch(() => {});
                }
            } catch (e) {}
        }
        return;
    }

    if (interaction.isModalSubmit()) {
        try {
            await handleModalSubmit(interaction);
        } catch (error) {
            console.error('Modal submit error:', error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ An error occurred.', ephemeral: true }).catch(() => {});
                } else {
                    await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }).catch(() => {});
                }
            } catch (e) {}
        }
        return;
    }

    if (interaction.isStringSelectMenu()) {
        try {
            await handleSelectMenu(interaction);
        } catch (error) {
            console.error('Select menu error:', error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ An error occurred.', ephemeral: true }).catch(() => {});
                } else {
                    await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }).catch(() => {});
                }
            } catch (e) {}
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;
    
    const { commandName, options } = interaction;
    
    try {
        switch (commandName) {
            case 'setup': await handleSetup(interaction); break;
            case 'welcome': await handleWelcomePost(interaction); break;
            case 'setign': await handleSetIGN(interaction, options.getUser('member'), options.getString('ign')); break;
            case 'addcode': await handleAddCode(interaction, options.getString('code'), options.getString('description'), options.getString('expiry')); break;
            case 'editcode': await handleEditCode(interaction, options.getString('code'), options.getString('description'), options.getString('status')); break;
            case 'removecode': await handleRemoveCode(interaction, options.getString('code')); break;
            case 'codes': await handleCodes(interaction); break;
            case 'allcodes': await handleAllCodes(interaction); break;
            case 'applications': await handleApplications(interaction); break;
            case 'kick': await handleKick(interaction, options.getUser('member'), options.getString('reason')); break;
            case 'inactive': await handleInactive(interaction, options.getInteger('days') || 14); break;
            case 'translate': await handleTranslate(interaction, options.getString('text'), options.getString('to')); break;
            case 'languages': await handleLanguages(interaction); break;
            case 'help': await handleHelp(interaction); break;
            case 'gameinfo': await handleGameInfo(interaction); break;
            case 'redeem': await handleRedeem(interaction); break;
            case 'setrank': await handleSetRank(interaction, options.getUser('member'), options.getString('rank')); break;
            case 'translationguide': await handleTranslationGuide(interaction); break;
            case 'setlanguage': await handleSetLanguage(interaction, options.getString('language')); break;
            case 'setup-language-channels': await handleSetupLanguageChannels(interaction); break;
            case 'adminhelp': await handleAdminHelp(interaction); break;
        }
    } catch (error) {
        console.error('Command error:', error);
        try {
            const errorMsg = { content: '❌ An error occurred while executing this command.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg).catch(() => {});
            } else {
                await interaction.reply(errorMsg).catch(() => {});
            }
        } catch (e) {
            // Ignore errors when trying to respond to failed interactions
        }
    }
});

// ============================================
// COMMAND HANDLERS
// ============================================

async function handleSetup(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;

    try {
        // Create roles with hierarchy (3-tier system)
        const roles = [
            { name: 'Guild Master', color: '#FFD700', hoist: true, permissions: [PermissionFlagsBits.Administrator], rank: 'GuildMaster' },
            { name: 'R4', color: '#2ecc71', hoist: true, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers], rank: 'R4' },
            { name: 'Member', color: '#FFD700', hoist: true, rank: 'Member' },
            { name: 'Applicant', color: '#7f8c8d', hoist: false, rank: 'applicant' }
        ];

        const createdRoles = {};
        for (const roleData of roles) {
            let role = guild.roles.cache.find(r => r.name === roleData.name);
            if (!role) {
                role = await guild.roles.create({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    permissions: roleData.permissions || []
                });
            }
            createdRoles[roleData.name] = role;
        }

        // Create language roles for channel access
        const langRolesCreated = [];
        for (const [langCode, langConfig] of Object.entries(LANGUAGE_ROLES)) {
            let role = guild.roles.cache.find(r => r.name === langConfig.name);
            if (!role) {
                role = await guild.roles.create({
                    name: langConfig.name,
                    color: langConfig.color,
                    hoist: false,
                    permissions: []
                });
                langRolesCreated.push(langConfig.name);
            }
        }

        const langRolesMsg = langRolesCreated.length > 0
            ? `\n\n**Language roles created:**\n${langRolesCreated.map(r => `• ${r}`).join('\n')}`
            : '\n\n**Language roles:** Already exist';

        await interaction.editReply(`✅ Server setup complete!\n\n**Roles created/verified:**\n• Guild Master (Admin)\n• R4 (Officer)\n• Member\n• Applicant${langRolesMsg}\n\n**Next steps:**\n1. Run \`/setup-language-channels\` to configure channel permissions\n2. Use \`/welcome\` to post the welcome message`);
    } catch (error) {
        console.error('Setup error:', error);
        await interaction.editReply('❌ Error during setup: ' + error.message);
    }
}

// Post translation guide with all language flags
async function postTranslationGuide(channel) {
    const embed1 = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌐 Translation Guide')
        .setDescription('**This channel supports 30+ languages!**\n\n🤖 **Auto-Translation:** All non-English messages are automatically translated to English.\n\n🚩 **Manual Translation:** React to any message with a flag emoji to translate it to that language!')
        .setTimestamp();

    const embed2 = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌏 Asian Languages')
        .addFields(
            { name: '🇻🇳 Vietnamese', value: 'React with 🇻🇳', inline: true },
            { name: '🇹🇭 Thai', value: 'React with 🇹🇭', inline: true },
            { name: '🇰🇷 Korean', value: 'React with 🇰🇷', inline: true },
            { name: '🇯🇵 Japanese', value: 'React with 🇯🇵', inline: true },
            { name: '🇨🇳 Chinese (Simplified)', value: 'React with 🇨🇳', inline: true },
            { name: '🇹🇼 Chinese (Traditional)', value: 'React with 🇹🇼', inline: true },
            { name: '🇮🇩 Indonesian', value: 'React with 🇮🇩', inline: true },
            { name: '🇲🇾 Malay', value: 'React with 🇲🇾', inline: true },
            { name: '🇵🇭 Filipino', value: 'React with 🇵🇭', inline: true },
            { name: '🇮🇳 Hindi', value: 'React with 🇮🇳', inline: true },
            { name: '🇲🇲 Myanmar', value: 'React with 🇲🇲', inline: true }
        );

    const embed3 = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌍 European Languages')
        .addFields(
            { name: '🇺🇸 English (US)', value: 'React with 🇺🇸', inline: true },
            { name: '🇬🇧 English (UK)', value: 'React with 🇬🇧', inline: true },
            { name: '🇪🇸 Spanish', value: 'React with 🇪🇸', inline: true },
            { name: '🇫🇷 French', value: 'React with 🇫🇷', inline: true },
            { name: '🇩🇪 German', value: 'React with 🇩🇪', inline: true },
            { name: '🇮🇹 Italian', value: 'React with 🇮🇹', inline: true },
            { name: '🇵🇹 Portuguese', value: 'React with 🇵🇹', inline: true },
            { name: '🇧🇷 Portuguese (Brazil)', value: 'React with 🇧🇷', inline: true },
            { name: '🇷🇺 Russian', value: 'React with 🇷🇺', inline: true },
            { name: '🇵🇱 Polish', value: 'React with 🇵🇱', inline: true },
            { name: '🇳🇱 Dutch', value: 'React with 🇳🇱', inline: true },
            { name: '🇹🇷 Turkish', value: 'React with 🇹🇷', inline: true },
            { name: '🇬🇷 Greek', value: 'React with 🇬🇷', inline: true },
            { name: '🇺🇦 Ukrainian', value: 'React with 🇺🇦', inline: true },
            { name: '🇷🇴 Romanian', value: 'React with 🇷🇴', inline: true },
            { name: '🇨🇿 Czech', value: 'React with 🇨🇿', inline: true },
            { name: '🇸🇪 Swedish', value: 'React with 🇸🇪', inline: true },
            { name: '🇳🇴 Norwegian', value: 'React with 🇳🇴', inline: true },
            { name: '🇩🇰 Danish', value: 'React with 🇩🇰', inline: true },
            { name: '🇫🇮 Finnish', value: 'React with 🇫🇮', inline: true },
            { name: '🇭🇺 Hungarian', value: 'React with 🇭🇺', inline: true }
        );

    const embed4 = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌍 Middle Eastern Languages')
        .addFields(
            { name: '🇸🇦 Arabic', value: 'React with 🇸🇦', inline: true },
            { name: '🇮🇱 Hebrew', value: 'React with 🇮🇱', inline: true },
            { name: '🇮🇷 Persian', value: 'React with 🇮🇷', inline: true }
        )
        .setFooter({ text: 'TopHeroes Guild Bot • Use /translate for manual translation' });

    await channel.send({ embeds: [embed1, embed2, embed3, embed4] });
}

// Handler for /translationguide command
async function handleTranslationGuide(interaction) {
    await postTranslationGuide(interaction.channel);
    await interaction.reply({ content: '✅ Translation guide posted!', ephemeral: true });
}

// Interactive welcome message with Apply button
async function handleWelcomePost(interaction) {
    const welcomeEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏰 Welcome to TopHeroes Guild!')
        .setDescription('Welcome to our guild community for **Top Heroes: Kingdom Saga**!\n\nWe are an active guild looking for dedicated players to join our ranks.')
        .addFields(
            {
                name: '📋 How to Join',
                value: '1️⃣ Click the **Apply to Join** button below\n2️⃣ Fill out the application form (IGN + Experience)\n3️⃣ **Select your preferred language** for chat\n4️⃣ Wait for an admin to review your application\n5️⃣ Once approved, you\'ll get access to your channels!',
                inline: false
            },
            {
                name: '🌐 Language Channels',
                value: 'During application, choose your preferred language:\n• **English** - Access to #general-chat only\n• **Other languages** - Access to #general-chat + your language channel\n\n🇻🇳 Vietnamese • 🇰🇷 Korean • 🇯🇵 Japanese • 🇨🇳 Chinese\n🇹🇭 Thai • 🇷🇺 Russian • 🇺🇦 Ukrainian • 🇮🇩 Indonesian',
                inline: false
            },
            {
                name: '🔄 Auto-Translation',
                value: '• Messages in #general-chat are **auto-translated** to all language channels\n• Messages in language channels are **auto-translated** to English in #general-chat\n• React with a flag emoji to translate any message!',
                inline: false
            },
            {
                name: '✨ What You Get as a Member',
                value: '• Free game codes & tips in #game-codes\n• Team finder for co-op play\n• Use `/setlanguage` to change your language anytime\n• Active community of players worldwide',
                inline: false
            },
            {
                name: '📜 Guild Rules',
                value: '• Be respectful to all members\n• No spam or self-promotion\n• Stay active - we check activity regularly\n• Help fellow guild members when possible',
                inline: false
            }
        )
        .setImage('https://play-lh.googleusercontent.com/zfPBl6wC4GdJGw5KKx6n5DOMFKNwkXSJmjwz-rFj4qrPrXzC0dwPNfp_p0GjGf5bEQ')
        .setFooter({ text: 'TopHeroes Guild Bot • Click Apply to Join below!' })
        .setTimestamp();

    const applyButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('apply_button')
            .setLabel('📝 Apply to Join')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🏰'),
        new ButtonBuilder()
            .setLabel('Official Discord')
            .setStyle(ButtonStyle.Link)
            .setURL(GAME_INFO.discord)
            .setEmoji('🔗')
    );

    await interaction.channel.send({ embeds: [welcomeEmbed], components: [applyButton] });
    await interaction.reply({ content: '✅ Welcome message posted!', ephemeral: true });
}

// Admin command to set member IGN and nickname
async function handleSetIGN(interaction, targetUser, ign) {
    if (!targetUser) {
        await interaction.reply({ content: '❌ Please specify a member.', ephemeral: true });
        return;
    }

    try {
        const member = await interaction.guild.members.fetch(targetUser.id);
        let nicknameSet = true;
        let nicknameError = null;

        // Try to update nickname
        try {
            await member.setNickname(ign);
        } catch (nickError) {
            nicknameSet = false;
            nicknameError = nickError.message;
        }

        // Update database regardless of nickname success
        if (db.members[targetUser.id]) {
            db.members[targetUser.id].ign = ign;
        } else {
            db.members[targetUser.id] = {
                discordId: targetUser.id,
                discordName: targetUser.username,
                ign: ign,
                joinDate: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                role: 'member',
                notes: ''
            };
        }
        saveDatabase(db);

        if (nicknameSet) {
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ IGN Updated!')
                .setDescription(`**${targetUser.username}**'s IGN has been set to: **${ign}**\nTheir server nickname has been updated.`);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // Nickname failed but database updated
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⚠️ IGN Saved (Nickname Not Changed)')
                .setDescription(`**${targetUser.username}**'s IGN has been saved to database as: **${ign}**`)
                .addFields({
                    name: '❌ Could Not Change Nickname',
                    value: nicknameError.includes('Missing Permissions')
                        ? '**Reason:** Bot lacks permission to change this user\'s nickname.\n\n**Common causes:**\n• User is the server owner (bots cannot change owner nicknames)\n• User\'s role is higher than the bot\'s role\n\n**Solution:** The user should manually change their nickname:\n1. Right-click your name → Edit Server Profile\n2. Set nickname to: `' + ign + '`'
                        : `Error: ${nicknameError}`
                });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    } catch (error) {
        await interaction.reply({ content: `❌ Failed to update: ${error.message}`, ephemeral: true });
    }
}

async function handleAddCode(interaction, code, description, expiry) {
    const exists = db.gameCodes.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (exists) {
        await interaction.reply({ content: '❌ This code already exists!', ephemeral: true });
        return;
    }

    db.gameCodes.push({
        code: code,
        description: description,
        status: 'active',
        addedBy: interaction.user.username,
        addedAt: new Date().toISOString(),
        expiryDate: expiry || null
    });
    saveDatabase(db);
    
    const codesChannel = interaction.guild.channels.cache.find(
        ch => ch.name === '🎁game-codes' || ch.name === 'game-codes'
    );
    
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎁 New Game Code!')
        .setDescription(`**Game:** ${GAME_INFO.name}`)
        .addFields(
            { name: '📝 Code', value: `\`${code}\``, inline: true },
            { name: '🎁 Rewards', value: description, inline: true }
        )
        .setFooter({ text: `Posted by ${interaction.user.username} | Use /redeem for instructions` })
        .setTimestamp();
    
    if (expiry) embed.addFields({ name: '⏰ Expires', value: expiry, inline: true });
    if (codesChannel) await codesChannel.send({ content: '@everyone New code available!', embeds: [embed] });
    
    await interaction.reply({ content: '✅ Code added successfully!', ephemeral: true });
}

async function handleEditCode(interaction, code, newDescription, newStatus) {
    const codeIndex = db.gameCodes.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
    if (codeIndex === -1) {
        await interaction.reply({ content: '❌ Code not found!', ephemeral: true });
        return;
    }

    const updates = [];
    if (newDescription) {
        db.gameCodes[codeIndex].description = newDescription;
        updates.push(`Description → "${newDescription}"`);
    }
    if (newStatus) {
        db.gameCodes[codeIndex].status = newStatus;
        updates.push(`Status → ${newStatus}`);
    }

    if (updates.length === 0) {
        await interaction.reply({ content: '❌ No changes specified! Use description or status options.', ephemeral: true });
        return;
    }

    db.gameCodes[codeIndex].editedBy = interaction.user.username;
    db.gameCodes[codeIndex].editedAt = new Date().toISOString();
    saveDatabase(db);

    await interaction.reply({ content: `✅ Code \`${code}\` updated!\n${updates.join('\n')}`, ephemeral: true });
}

async function handleRemoveCode(interaction, code) {
    const codeIndex = db.gameCodes.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
    if (codeIndex === -1) {
        await interaction.reply({ content: '❌ Code not found!', ephemeral: true });
        return;
    }

    const removedCode = db.gameCodes.splice(codeIndex, 1)[0];
    saveDatabase(db);

    await interaction.reply({ content: `✅ Code \`${removedCode.code}\` has been removed!`, ephemeral: true });
}

async function handleCodes(interaction) {
    const activeCodes = db.gameCodes.filter(c => c.status === 'active');

    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎁 Active Game Codes - Top Heroes')
        .setDescription('Copy and redeem these codes in-game!\n**How to redeem:** `/redeem`')
        .setTimestamp();

    if (activeCodes.length > 0) {
        let codeList = activeCodes.map(c => `\`${c.code}\` - ${c.description}`).join('\n');
        embed.addFields({ name: '🔥 Known Working Codes', value: codeList.substring(0, 1024) });
    } else {
        embed.setDescription('No active codes at the moment. Check back later!');
    }

    embed.addFields({
        name: '📌 Code Sources',
        value: `• [Pro Game Guides](https://progameguides.com/top-heroes/top-heroes-codes/)\n• [Pocket Gamer](https://www.pocketgamer.com/top-heroes/codes/)\n• [Official Discord](${GAME_INFO.discord})`
    });

    await interaction.reply({ embeds: [embed] });
}

async function handleAllCodes(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('📚 All Known Top Heroes Codes')
        .setDescription('Complete list of all codes (some may be expired)')
        .setTimestamp();

    const active = db.gameCodes.filter(c => c.status === 'active');
    const expired = db.gameCodes.filter(c => c.status === 'expired');

    if (active.length > 0) {
        embed.addFields({
            name: '✅ Active Codes',
            value: active.map(c => `\`${c.code}\``).join(', ').substring(0, 1024)
        });
    }

    if (expired.length > 0) {
        embed.addFields({
            name: '❌ Expired Codes (for reference)',
            value: expired.map(c => `\`${c.code}\``).join(', ').substring(0, 1024)
        });
    }

    if (active.length === 0 && expired.length === 0) {
        embed.setDescription('No codes in the database yet.');
    }

    embed.addFields({
        name: '💡 Tip',
        value: 'Try expired codes anyway - they sometimes get reactivated during events!'
    });

    await interaction.reply({ embeds: [embed] });
}

async function handleApply(interaction) {
    // Check if already a member (Member, R4, or Guild Master role)
    const guildMember = await interaction.guild.members.fetch(interaction.user.id);
    const hasGuildRole = guildMember.roles.cache.some(r =>
        r.name === 'Member' || r.name === 'R4' || r.name === 'Guild Master'
    );

    if (hasGuildRole) {
        await interaction.reply({ content: '✅ You are already a guild member!', ephemeral: true });
        return;
    }

    // Check for pending application
    const existing = db.applications.find(a => a.discordId === interaction.user.id && a.status === 'pending');
    if (existing) {
        await interaction.reply({ content: '⏳ You already have a pending application! Please wait for an admin to review it.', ephemeral: true });
        return;
    }

    // Check if previously rejected (allow reapplication after 24 hours)
    const rejected = db.applications.find(a => a.discordId === interaction.user.id && a.status === 'rejected');
    if (rejected) {
        const rejectedTime = new Date(rejected.reviewedAt);
        const hoursSinceRejection = (Date.now() - rejectedTime.getTime()) / (1000 * 60 * 60);
        if (hoursSinceRejection < 24) {
            const hoursLeft = Math.ceil(24 - hoursSinceRejection);
            await interaction.reply({ content: `❌ Your previous application was rejected. You can reapply in ${hoursLeft} hour(s).`, ephemeral: true });
            return;
        }
    }

    const modal = new ModalBuilder()
        .setCustomId('application_modal')
        .setTitle('TopHeroes Guild Application');

    modal.addComponents(
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('ign')
                .setLabel('What is your In-Game Name (IGN)?')
                .setPlaceholder('Enter your exact in-game name')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(30)
        ),
        new ActionRowBuilder().addComponents(
            new TextInputBuilder()
                .setCustomId('experience')
                .setLabel('How long have you been playing?')
                .setPlaceholder('e.g., 2 months, 1 year, just started')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        )
    );

    await interaction.showModal(modal);
}

async function handleApplications(interaction) {
    const apps = db.applications.filter(a => a.status === 'pending');

    if (apps.length === 0) {
        await interaction.reply({ content: '📋 No pending applications.\n\n*Applications appear here when users click "Apply to Join" in the welcome channel.*', ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('📝 Pending Applications')
        .setDescription(`**${apps.length}** application(s) waiting for review\n\n*Select an application below to review it.*`)
        .setTimestamp();

    for (const app of apps.slice(0, 5)) {
        embed.addFields({
            name: `${app.discordName} (IGN: ${app.ign})`,
            value: `🏰 Castle: ${app.castleLevel || 'N/A'} | ⏱️ ${app.experience}\n📝 ${app.whyJoin.substring(0, 80)}...`,
            inline: false
        });
    }

    if (apps.length > 5) {
        embed.setFooter({ text: `Showing 5 of ${apps.length} applications` });
    }

    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('application_action')
            .setPlaceholder('Select an application to review')
            .addOptions(apps.slice(0, 10).map(app => ({
                label: `${app.discordName} - ${app.ign}`,
                value: `${app.id}`,
                description: `Castle: ${app.castleLevel || 'N/A'} | ${app.experience.substring(0, 40)}`
            })))
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

async function handleKick(interaction, targetUser, reason) {
    if (!targetUser) {
        await interaction.reply({ content: '❌ Please specify a member to kick.', ephemeral: true });
        return;
    }
    
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) {
        await interaction.reply({ content: '❌ Member not found in server.', ephemeral: true });
        return;
    }
    
    delete db.members[targetUser.id];
    saveDatabase(db);
    
    try {
        await member.kick(reason || 'Removed by guild admin');
        await interaction.reply({ content: `✅ ${targetUser.username} has been kicked.`, ephemeral: true });
    } catch (error) {
        await interaction.reply({ content: `❌ Failed to kick: ${error.message}`, ephemeral: true });
    }
}

async function handleInactive(interaction, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const inactive = Object.values(db.members).filter(m => {
        if (!m.lastActive) return true;
        return new Date(m.lastActive) < cutoffDate;
    });
    
    if (inactive.length === 0) {
        await interaction.reply({ content: `✅ No members inactive for ${days}+ days!`, ephemeral: true });
        return;
    }
    
    const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle(`⚠️ Inactive Members (${days}+ days)`)
        .setDescription(`Found ${inactive.length} inactive member(s)`)
        .setTimestamp();
    
    const memberList = inactive.slice(0, 15).map(m => {
        const lastActive = m.lastActive ? new Date(m.lastActive).toLocaleDateString() : 'Never';
        return `• ${m.ign} (<@${m.discordId}>) - Last: ${lastActive}`;
    }).join('\n');
    
    embed.addFields({ name: 'Members', value: memberList || 'None' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleTranslate(interaction, text, targetLang) {
    await interaction.deferReply();
    const translated = await translateText(text, targetLang);
    
    if (translated) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🌐 Translation')
            .addFields(
                { name: 'Original', value: text.substring(0, 1024) },
                { name: languageNames[targetLang], value: translated.substring(0, 1024) }
            )
            .setFooter({ text: `Requested by ${interaction.user.username}` })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    } else {
        await interaction.editReply('❌ Translation failed. Please try again.');
    }
}

async function handleLanguages(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌐 Supported Languages')
        .setDescription('React with any of these flags to translate a message!\n\n**Supported flags:**')
        .addFields(
            { name: '🌏 Asian', value: '🇻🇳 🇹🇭 🇰🇷 🇯🇵 🇨🇳 🇹🇼 🇮🇩 🇲🇾 🇵🇭 🇮🇳 🇲🇲', inline: false },
            { name: '🌍 European', value: '🇺🇸 🇬🇧 🇪🇸 🇫🇷 🇩🇪 🇮🇹 🇵🇹 🇧🇷 🇷🇺 🇵🇱 🇳🇱 🇹🇷 🇬🇷 🇺🇦 🇷🇴 🇨🇿 🇸🇪 🇳🇴 🇩🇰 🇫🇮 🇭🇺', inline: false },
            { name: '🌍 Middle East', value: '🇸🇦 🇮🇱 🇮🇷', inline: false }
        )
        .setFooter({ text: 'Or use /translate command for manual translation' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

async function handleHelp(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📚 TopHeroes Bot Commands')
        .setDescription(`**Game:** ${GAME_INFO.name}`)
        .addFields(
            { name: '🌐 Language & Translation', value:
                '`/setlanguage` - Change your language channel\n' +
                '`/translate <text> <lang>` - Translate text manually\n' +
                '`/languages` - Show all 30+ supported languages\n\n' +
                '🔄 **Auto-Translation:**\n' +
                '• #general-chat messages translate to all language channels\n' +
                '• Language channel messages translate to #general-chat\n' +
                '🚩 React with a flag emoji to translate any message!'
            },
            { name: '🎮 Game Commands', value:
                '`/codes` - View active game codes\n' +
                '`/allcodes` - View all known codes (active + expired)\n' +
                '`/redeem` - How to redeem codes in-game\n' +
                '`/gameinfo` - Game information and links'
            }
        )
        .setFooter({ text: 'TopHeroes Guild Bot • Your nickname = Your IGN' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleGameInfo(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`🎮 ${GAME_INFO.name}`)
        .setDescription('Fantasy RPG strategy game - Build kingdoms, collect heroes, conquer enemies!')
        .addFields(
            { name: '🏢 Developer', value: GAME_INFO.developer, inline: true },
            { name: '📱 Platforms', value: 'iOS, Android, PC', inline: true },
            { name: '🌐 Languages', value: '17+ languages supported', inline: true },
            { name: '🔗 Useful Links', value: 
                `• [Official Website](${GAME_INFO.website})\n` +
                `• [Official Discord](${GAME_INFO.discord})\n` +
                `• Support: ${GAME_INFO.support}`
            },
            { name: '📊 Code Sources', value:
                '• [Pro Game Guides](https://progameguides.com/top-heroes/top-heroes-codes/)\n' +
                '• [Pocket Gamer](https://www.pocketgamer.com/top-heroes/codes/)\n' +
                '• [SuperCheats](https://www.supercheats.com/top-heroes-kingdom-saga-codes)'
            }
        )
        .setFooter({ text: 'Use /codes to see active game codes!' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

async function handleRedeem(interaction) {
    const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🎁 How to Redeem Codes in Top Heroes')
        .setDescription('Follow these steps to redeem your gift codes:')
        .addFields(
            { name: 'Step 1', value: '📱 Launch Top Heroes on your device' },
            { name: 'Step 2', value: '👤 Tap the **Avatar** icon (top-left corner)' },
            { name: 'Step 3', value: '⚙️ Tap **Settings** (bottom of screen)' },
            { name: 'Step 4', value: '🎁 Tap **Gift Code** button' },
            { name: 'Step 5', value: '📝 Enter your code in the text box' },
            { name: 'Step 6', value: '✅ Tap **Confirm** to claim rewards!' },
            { name: '⚠️ Important Notes', value:
                '• Codes are **case-sensitive**\n' +
                '• Most codes require **Castle Level 10+**\n' +
                '• Each code can only be used **once per account**\n' +
                '• Some codes are **region-locked**'
            }
        )
        .setFooter({ text: 'Use /codes to see active codes!' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

async function handleSetRank(interaction, targetUser, rank) {
    if (!targetUser) {
        await interaction.reply({ content: '❌ Please specify a member.', ephemeral: true });
        return;
    }

    // Defer reply immediately to prevent timeout
    await interaction.deferReply({ ephemeral: true });

    const rankRoleNames = {
        'Member': 'Member',
        'R4': 'R4',
        'GuildMaster': 'Guild Master'
    };

    const rankColors = {
        'Member': '#FFD700',
        'R4': '#2ecc71',
        'GuildMaster': '#FFD700'
    };

    try {
        const member = await interaction.guild.members.fetch(targetUser.id);
        const newRoleName = rankRoleNames[rank];
        const newRole = interaction.guild.roles.cache.find(r => r.name === newRoleName);

        if (!newRole) {
            await interaction.editReply({ content: `❌ Role "${newRoleName}" not found. Please run /setup first.` });
            return;
        }

        // Remove all existing rank roles
        const existingRankRoles = member.roles.cache.filter(r =>
            r.name === 'Member' || r.name === 'R4' || r.name === 'Guild Master'
        );

        for (const role of existingRankRoles.values()) {
            await member.roles.remove(role);
        }

        // Add new rank role
        await member.roles.add(newRole);

        // Update database
        if (db.members[targetUser.id]) {
            db.members[targetUser.id].role = rank;
        } else {
            db.members[targetUser.id] = {
                discordId: targetUser.id,
                discordName: targetUser.username,
                ign: member.nickname || targetUser.username,
                joinDate: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                role: rank,
                notes: ''
            };
        }
        saveDatabase(db);

        const embed = new EmbedBuilder()
            .setColor(rankColors[rank])
            .setTitle('🏅 Rank Updated!')
            .setDescription(`**${targetUser.username}**'s rank has been set to: **${newRoleName}**`)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        await interaction.editReply({ content: `❌ Failed to set rank: ${error.message}` });
    }
}

async function handleSetLanguage(interaction, newLanguage) {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    // Check if user is a guild member (has Member, R4, or Guild Master role)
    const hasGuildRole = member.roles.cache.some(r =>
        r.name === 'Member' || r.name === 'R4' || r.name === 'Guild Master'
    );

    if (!hasGuildRole) {
        await interaction.reply({
            content: '❌ You must be a guild member to change your language preference.',
            ephemeral: true
        });
        return;
    }

    // Remove all existing language roles
    const existingLangRoles = member.roles.cache.filter(r => r.name.startsWith('Lang-'));
    for (const role of existingLangRoles.values()) {
        await member.roles.remove(role);
    }

    // Add new language role
    const langRoleConfig = LANGUAGE_ROLES[newLanguage];
    let assignedRole = null;
    if (langRoleConfig) {
        const newLangRole = interaction.guild.roles.cache.find(r => r.name === langRoleConfig.name);
        if (newLangRole) {
            await member.roles.add(newLangRole);
            assignedRole = langRoleConfig.name;
        }
    }

    // Update database
    if (db.members[interaction.user.id]) {
        db.members[interaction.user.id].preferredLanguage = newLanguage;
        saveDatabase(db);
    }

    const langName = langRoleConfig ? langRoleConfig.name.replace('Lang-', '') : 'English';
    const channelAccess = newLanguage === 'en'
        ? 'general-chat only'
        : `general-chat + ${langRoleConfig.channelNames[0]}`;

    const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🌐 Language Changed!')
        .setDescription(`Your language preference has been changed to **${langName}**!`)
        .addFields(
            { name: '📺 Channel Access', value: channelAccess, inline: false }
        )
        .setFooter({ text: 'TopHeroes Guild Bot' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleSetupLanguageChannels(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;

    try {
        const results = [];

        // Find Member role to deny access on language channels
        const memberRole = guild.roles.cache.find(r => r.name === 'Member');

        // Configure each language channel
        for (const lang of BRIDGE_CHANNELS.languages) {
            const langRoleConfig = LANGUAGE_ROLES[lang.code];
            if (!langRoleConfig) continue;

            // Find the language role
            const langRole = guild.roles.cache.find(r => r.name === langRoleConfig.name);
            if (!langRole) {
                results.push(`⚠️ ${lang.label}: Role not found (run /setup first)`);
                continue;
            }

            // Find the language channel
            let channel = null;
            for (const channelName of lang.names) {
                channel = guild.channels.cache.find(ch =>
                    ch.name.toLowerCase().includes(channelName.toLowerCase()) && ch.type === ChannelType.GuildText
                );
                if (channel) break;
            }

            if (!channel) {
                results.push(`⚠️ ${lang.label}: Channel not found`);
                continue;
            }

            // Set permissions: deny @everyone and Member role, allow language role
            await channel.permissionOverwrites.edit(guild.roles.everyone, {
                ViewChannel: false
            });

            // Deny Member role to prevent broad access
            if (memberRole) {
                await channel.permissionOverwrites.edit(memberRole, {
                    ViewChannel: false
                });
            }

            await channel.permissionOverwrites.edit(langRole, {
                ViewChannel: true,
                SendMessages: true
            });

            results.push(`✅ ${lang.label}: #${channel.name} configured`);
        }

        // Ensure general-chat is visible to all language roles
        const generalChannel = guild.channels.cache.find(ch =>
            (ch.name.includes('general-chat') || ch.name === 'general') && ch.type === ChannelType.GuildText
        );

        if (generalChannel) {
            for (const [langCode, langConfig] of Object.entries(LANGUAGE_ROLES)) {
                const langRole = guild.roles.cache.find(r => r.name === langConfig.name);
                if (langRole) {
                    await generalChannel.permissionOverwrites.edit(langRole, {
                        ViewChannel: true,
                        SendMessages: true
                    });
                }
            }
            results.push(`✅ General chat: All language roles can access`);
        }

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🌐 Language Channel Setup Complete')
            .setDescription(results.join('\n'))
            .addFields({
                name: '📋 Next Steps',
                value: '• New applicants will select their language during application\n• Existing members can use `/setlanguage` to set their preference\n• Admins can manually assign `Lang-*` roles to existing members'
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Setup language channels error:', error);
        await interaction.editReply({ content: `❌ Error: ${error.message}` });
    }
}

async function handleAdminHelp(interaction) {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const isGuildMaster = member.roles.cache.some(r => r.name === 'Guild Master');
    const isR4 = member.roles.cache.some(r => r.name === 'R4');

    const r4Embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('🛡️ R4 Commands')
        .setDescription('Commands available to R4 officers:')
        .addFields(
            { name: '👥 Member Management', value:
                '`/applications` - View and review pending applications\n' +
                '`/setign @member <ign>` - Set member\'s IGN and nickname\n' +
                '`/inactive [days]` - List inactive members (default: 14 days)\n' +
                '`/kick @member [reason]` - Remove a member from the guild'
            },
            { name: '🎁 Code Management', value:
                '`/addcode <code> <description> [expiry]` - Add new game code\n' +
                '`/editcode <code> [description] [status]` - Edit existing code\n' +
                '`/removecode <code>` - Remove a game code'
            },
            { name: '🌐 Language Roles', value:
                'Manually assign `Lang-*` roles to members via Discord:\n' +
                'Right-click member → Roles → Add language role\n' +
                '• Lang-English, Lang-Vietnamese, Lang-Korean\n' +
                '• Lang-Japanese, Lang-Chinese, Lang-Thai\n' +
                '• Lang-Russian, Lang-Ukrainian, Lang-Indonesian'
            }
        );

    const gmEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('👑 Guild Master Commands')
        .setDescription('Additional commands for Guild Masters:')
        .addFields(
            { name: '⚙️ Server Setup', value:
                '`/setup` - Create all roles (guild ranks + language roles)\n' +
                '`/setup-language-channels` - Configure language channel permissions\n' +
                '`/welcome` - Post the welcome message with Apply button'
            },
            { name: '👥 Advanced Management', value:
                '`/setrank @member <rank>` - Change member rank (Member/R4/Guild Master)\n' +
                '`/translationguide` - Post the translation guide'
            },
            { name: '🌐 Language Roles', value:
                'Manually assign `Lang-*` roles to existing members:\n' +
                '• Lang-English (general-chat only)\n' +
                '• Lang-Vietnamese, Lang-Korean, Lang-Japanese\n' +
                '• Lang-Chinese, Lang-Thai, Lang-Russian\n' +
                '• Lang-Ukrainian, Lang-Indonesian'
            }
        );

    const embeds = [r4Embed];
    if (isGuildMaster) {
        embeds.push(gmEmbed);
    }

    await interaction.reply({ embeds: embeds, ephemeral: true });
}

// ============================================
// INTERACTION HANDLERS
// ============================================

async function handleButtonInteraction(interaction) {
    const customId = interaction.customId;

    // Handle Apply button from welcome message
    if (customId === 'apply_button') {
        await handleApply(interaction);
        return;
    }

    const parts = customId.split('_');
    const action = parts[0];
    const appId = parts[1];
    const selectedRank = parts[2] || 'Member'; // Default to Member if not specified

    if (action === 'approve' || action === 'reject') {
        // Defer the update immediately to prevent timeout
        await interaction.deferUpdate();

        const status = action === 'approve' ? 'approved' : 'rejected';
        const appIndex = db.applications.findIndex(a => a.id === parseInt(appId));

        if (appIndex === -1) {
            await interaction.editReply({ content: '❌ Application not found.', embeds: [], components: [] });
            return;
        }

        const app = db.applications[appIndex];
        app.status = status;
        app.reviewedBy = interaction.user.username;
        app.reviewedAt = new Date().toISOString();

        if (action === 'approve') {
            const rankNames = {
                'Member': 'Member',
                'R4': 'R4',
                'GuildMaster': 'Guild Master'
            };

            const langPreference = app.preferredLanguage || 'en';
            db.members[app.discordId] = {
                discordId: app.discordId,
                discordName: app.discordName,
                ign: app.ign,
                castleLevel: app.castleLevel || 'Unknown',
                joinDate: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                role: selectedRank,
                preferredLanguage: langPreference,
                notes: ''
            };

            let nicknameSet = true;
            let assignedRole = null;
            let assignedLangRole = null;
            try {
                const member = await interaction.guild.members.fetch(app.discordId);

                // Try to set nickname to IGN
                try {
                    await member.setNickname(app.ign);
                } catch (nickError) {
                    nicknameSet = false;
                    console.log('Could not set nickname:', nickError.message);
                }

                // Add the selected rank role
                const roleName = rankNames[selectedRank];
                const role = interaction.guild.roles.cache.find(r => r.name === roleName);
                if (role) {
                    await member.roles.add(role);
                    assignedRole = roleName;
                }

                // Add the language role based on preference
                const langRoleConfig = LANGUAGE_ROLES[langPreference];
                if (langRoleConfig) {
                    const langRole = interaction.guild.roles.cache.find(r => r.name === langRoleConfig.name);
                    if (langRole) {
                        await member.roles.add(langRole);
                        assignedLangRole = langRoleConfig.name;
                    }
                }

                // Remove Applicant role if exists
                const applicantRole = interaction.guild.roles.cache.find(r => r.name === 'Applicant');
                if (applicantRole && member.roles.cache.has(applicantRole.id)) {
                    await member.roles.remove(applicantRole);
                }

                // Send DM to approved user
                try {
                    const langChannelInfo = langPreference === 'en'
                        ? 'general-chat only'
                        : `general-chat + ${LANGUAGE_ROLES[langPreference].channelNames[0]}`;

                    const dmEmbed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('🎉 Welcome to TopHeroes Guild!')
                        .setDescription(`Your application has been **approved**!\n\nYou now have access to your language channels.`)
                        .addFields(
                            { name: '🎮 Your IGN', value: app.ign, inline: true },
                            { name: '🏅 Your Rank', value: assignedRole || 'Member', inline: true },
                            { name: '🌐 Channel Access', value: langChannelInfo, inline: true },
                            { name: '👤 Your Nickname', value: nicknameSet ? `Set to: ${app.ign}` : '⚠️ Please set manually (see below)', inline: false },
                            { name: '📋 Next Steps', value: '• Check out #💬general-chat to introduce yourself\n• Visit #🎁game-codes for free rewards\n• Use `/setlanguage` to change your language channel' }
                        );

                    if (!nicknameSet) {
                        dmEmbed.addFields({
                            name: '⚠️ Set Your Nickname',
                            value: `Please set your server nickname to your IGN:\n1. Right-click your name in the member list\n2. Click "Edit Server Profile"\n3. Set nickname to: \`${app.ign}\``
                        });
                    }

                    dmEmbed.setFooter({ text: 'TopHeroes Guild Bot' }).setTimestamp();
                    await member.send({ embeds: [dmEmbed] });
                } catch (dmError) {
                    console.log('Could not send DM to user:', dmError.message);
                }

                // Send welcome message to general chat in COMMUNITY category
                try {
                    const generalChannel = interaction.guild.channels.cache.find(
                        ch => (ch.name === '💬general-chat' || ch.name === 'general-chat' || ch.name === 'general') &&
                              ch.parent?.name?.toUpperCase().includes('COMMUNITY')
                    );
                    if (generalChannel) {
                        await generalChannel.send(`🎉 Welcome <@${app.discordId}> to TopHeroes Guild! They joined as **${assignedRole || 'Member'}**. Say hi! 👋`);
                    }
                } catch (channelError) {
                    console.log('Could not send welcome to general chat:', channelError.message);
                }

            } catch (e) {
                console.log('Error during approval:', e.message);
            }

        } else {
            // Rejection - send DM and kick member
            try {
                const member = await interaction.guild.members.fetch(app.discordId);
                const dmEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Application Update')
                    .setDescription('Your application to **TopHeroes Guild** was not approved at this time.\n\nYou may reapply after 24 hours if you wish.')
                    .setFooter({ text: 'TopHeroes Guild Bot' })
                    .setTimestamp();

                // Send DM first, then kick
                try {
                    await member.send({ embeds: [dmEmbed] });
                } catch (dmError) {
                    console.log('Could not send rejection DM:', dmError.message);
                }

                // Kick the rejected member
                await member.kick('Application rejected');
            } catch (kickError) {
                console.log('Could not kick rejected member:', kickError.message);
            }
        }

        saveDatabase(db);

        if (action === 'approve') {
            const rankNames = {
                'Member': 'Member',
                'R4': 'R4',
                'GuildMaster': 'Guild Master'
            };
            await interaction.editReply({ content: `✅ Application approved! Assigned rank: **${rankNames[selectedRank]}**`, embeds: [], components: [] });
        } else {
            await interaction.editReply({ content: `✅ Application ${status}!`, embeds: [], components: [] });
        }
    }
}

async function handleModalSubmit(interaction) {
    if (interaction.customId === 'application_modal') {
        const ign = interaction.fields.getTextInputValue('ign');
        const experience = interaction.fields.getTextInputValue('experience');

        const appId = Date.now();
        db.applications.push({
            id: appId,
            discordId: interaction.user.id,
            discordName: interaction.user.username,
            ign: ign,
            experience: experience,
            status: 'pending',
            appliedAt: new Date().toISOString(),
            reviewedBy: null,
            reviewedAt: null
        });
        saveDatabase(db);

        // Give Applicant role and set nickname to IGN
        try {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const applicantRole = interaction.guild.roles.cache.find(r => r.name === 'Applicant');
            if (applicantRole) await member.roles.add(applicantRole);

            // Auto-set nickname to IGN
            await member.setNickname(ign);
        } catch (e) {
            console.log('Could not assign Applicant role or set nickname:', e.message);
        }

        // Send to admin applications channel
        const appChannel = interaction.guild.channels.cache.find(
            ch => ch.name === '📝applications' || ch.name === 'applications'
        );

        if (appChannel) {
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('📝 New Guild Application')
                .setThumbnail(interaction.user.displayAvatarURL())
                .addFields(
                    { name: '👤 Discord', value: `${interaction.user.username}\n<@${interaction.user.id}>`, inline: true },
                    { name: '🎮 IGN', value: ign, inline: true },
                    { name: '⏱️ Experience', value: experience, inline: true }
                )
                .setFooter({ text: `Application ID: ${appId}` })
                .setTimestamp();

            const rankRow = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`rank_select_${appId}`)
                    .setPlaceholder('Select rank before approving')
                    .addOptions([
                        { label: 'Member', value: 'Member', description: 'Regular member (default)', default: true },
                        { label: 'R4', value: 'R4', description: 'R4 rank' },
                        { label: 'Guild Master', value: 'GuildMaster', description: 'Guild Master' }
                    ])
            );

            const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`approve_${appId}_Member`)
                    .setLabel('✅ Approve as Member')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`reject_${appId}`)
                    .setLabel('❌ Reject')
                    .setStyle(ButtonStyle.Danger)
            );

            await appChannel.send({ embeds: [embed], components: [rankRow, buttonRow] });
        }

        // Send follow-up with language selection
        const langSelectRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`lang_select_${appId}`)
                .setPlaceholder('Select your preferred language')
                .addOptions([
                    { label: 'English (general-chat only)', value: 'en', emoji: '🇺🇸' },
                    { label: 'Vietnamese', value: 'vi', emoji: '🇻🇳' },
                    { label: 'Korean', value: 'ko', emoji: '🇰🇷' },
                    { label: 'Japanese', value: 'ja', emoji: '🇯🇵' },
                    { label: 'Chinese', value: 'zh-CN', emoji: '🇨🇳' },
                    { label: 'Thai', value: 'th', emoji: '🇹🇭' },
                    { label: 'Russian', value: 'ru', emoji: '🇷🇺' },
                    { label: 'Ukrainian', value: 'uk', emoji: '🇺🇦' },
                    { label: 'Indonesian', value: 'id', emoji: '🇮🇩' }
                ])
        );

        // Confirmation to user with language selection
        const confirmEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('📝 Application Submitted!')
            .setDescription('Your application has been submitted! **One more step:**\n\nSelect your preferred language channel below.')
            .addFields(
                { name: '🎮 IGN', value: ign, inline: true },
                { name: '⏱️ Experience', value: experience, inline: true },
                { name: '🌐 Language Selection', value: 'Choose a language to get access to that language channel alongside general-chat.\n\nEnglish users will only see general-chat.' }
            )
            .setFooter({ text: 'TopHeroes Guild Bot' })
            .setTimestamp();

        await interaction.reply({ embeds: [confirmEmbed], components: [langSelectRow], ephemeral: true });
    }
}

async function handleSelectMenu(interaction) {
    // Handle language selection during application
    if (interaction.customId.startsWith('lang_select_')) {
        const appId = interaction.customId.replace('lang_select_', '');
        const selectedLang = interaction.values[0];

        // Update application in database
        const appIndex = db.applications.findIndex(a => a.id === parseInt(appId));
        if (appIndex !== -1) {
            db.applications[appIndex].preferredLanguage = selectedLang;
            saveDatabase(db);
        }

        const langConfig = LANGUAGE_ROLES[selectedLang];
        const langName = langConfig ? langConfig.name.replace('Lang-', '') : 'English';
        const channelAccess = selectedLang === 'en'
            ? 'general-chat only'
            : `general-chat + ${langConfig.channelNames[0]}`;

        const confirmEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ Application Complete!')
            .setDescription(`Your language preference has been set to **${langName}**!`)
            .addFields(
                { name: '🌐 Channel Access', value: `You will have access to: **${channelAccess}**`, inline: false },
                { name: '⏳ What\'s Next?', value: 'An admin will review your application. You\'ll receive a DM when it\'s processed.\n\nThis usually takes less than 24 hours.' }
            )
            .setFooter({ text: 'TopHeroes Guild Bot • Use /setlanguage to change later' })
            .setTimestamp();

        await interaction.update({ embeds: [confirmEmbed], components: [] });
        return;
    }

    // Handle application selection
    if (interaction.customId === 'application_action') {
        const appId = parseInt(interaction.values[0]);
        const app = db.applications.find(a => a.id === appId);

        if (!app) {
            await interaction.reply({ content: '❌ Application not found.', ephemeral: true });
            return;
        }

        const langConfig = app.preferredLanguage ? LANGUAGE_ROLES[app.preferredLanguage] : null;
        const langDisplay = langConfig ? langConfig.name.replace('Lang-', '') : 'Not selected';

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle(`📝 Application Review`)
            .setDescription(`Reviewing application from **${app.discordName}**`)
            .addFields(
                { name: '👤 Discord', value: `<@${app.discordId}>`, inline: true },
                { name: '🎮 IGN', value: app.ign, inline: true },
                { name: '⏱️ Experience', value: app.experience, inline: true },
                { name: '📅 Applied', value: new Date(app.appliedAt).toLocaleString(), inline: true },
                { name: '🌐 Language', value: langDisplay, inline: true }
            )
            .setFooter({ text: 'Select a rank, then click Approve' });

        const rankRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`rank_select_${appId}`)
                .setPlaceholder('Select starting rank (default: Member)')
                .addOptions([
                    { label: 'Member', value: 'Member', description: 'Regular member (default)', default: true },
                    { label: 'R4', value: 'R4', description: 'R4 rank' },
                    { label: 'Guild Master', value: 'GuildMaster', description: 'Guild Master' }
                ])
        );

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`approve_${appId}_Member`).setLabel('✅ Approve as Member').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`reject_${appId}`).setLabel('❌ Reject').setStyle(ButtonStyle.Danger)
        );

        await interaction.update({ embeds: [embed], components: [rankRow, buttonRow] });
    }

    // Handle rank selection for application
    if (interaction.customId.startsWith('rank_select_')) {
        const appId = interaction.customId.replace('rank_select_', '');
        const selectedRank = interaction.values[0];
        const app = db.applications.find(a => a.id === parseInt(appId));

        if (!app) {
            await interaction.reply({ content: '❌ Application not found.', ephemeral: true });
            return;
        }

        const rankNames = {
            'Member': 'Member',
            'R4': 'R4',
            'GuildMaster': 'Guild Master'
        };

        const langConfig = app.preferredLanguage ? LANGUAGE_ROLES[app.preferredLanguage] : null;
        const langDisplay = langConfig ? langConfig.name.replace('Lang-', '') : 'Not selected';

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle(`📝 Application Review`)
            .setDescription(`Reviewing application from **${app.discordName}**`)
            .addFields(
                { name: '👤 Discord', value: `<@${app.discordId}>`, inline: true },
                { name: '🎮 IGN', value: app.ign, inline: true },
                { name: '⏱️ Experience', value: app.experience, inline: true },
                { name: '📅 Applied', value: new Date(app.appliedAt).toLocaleString(), inline: true },
                { name: '🌐 Language', value: langDisplay, inline: true },
                { name: '🏅 Selected Rank', value: `**${rankNames[selectedRank]}**`, inline: true }
            )
            .setFooter({ text: `Will be approved as ${rankNames[selectedRank]}` });

        const rankRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`rank_select_${appId}`)
                .setPlaceholder('Select starting rank')
                .addOptions([
                    { label: 'Member', value: 'Member', description: 'Regular member', default: selectedRank === 'Member' },
                    { label: 'R4', value: 'R4', description: 'R4 rank', default: selectedRank === 'R4' },
                    { label: 'Guild Master', value: 'GuildMaster', description: 'Guild Master', default: selectedRank === 'GuildMaster' }
                ])
        );

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`approve_${appId}_${selectedRank}`).setLabel(`✅ Approve as ${rankNames[selectedRank]}`).setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`reject_${appId}`).setLabel('❌ Reject').setStyle(ButtonStyle.Danger)
        );

        await interaction.update({ embeds: [embed], components: [rankRow, buttonRow] });
    }
}

// ============================================
// SCHEDULED TASKS
// ============================================

async function checkInactiveMembers() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const inactive = Object.values(db.members).filter(m => {
        if (!m.lastActive) return true;
        return new Date(m.lastActive) < cutoffDate;
    });

    if (inactive.length > 0) {
        console.log(`📊 Daily check: ${inactive.length} member(s) inactive for 30+ days`);
    }
}

async function checkForNewCodes() {
    console.log('🔍 Checking for new codes...');
    // This is a placeholder - in production, you'd scrape code websites
    // For now, it just logs that the check happened
    db.lastCodeCheck = new Date().toISOString();
    saveDatabase(db);
}

// ============================================
// ERROR HANDLERS - Prevent crashes
// ============================================
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
});

client.on('error', (error) => {
    console.error('❌ Client error:', error);
});

client.on('shardError', (error) => {
    console.error('❌ Shard error:', error);
});

client.on('shardDisconnect', (event, id) => {
    console.warn(`⚠️ Shard ${id} disconnected. Reconnecting...`);
});

client.on('shardReconnecting', (id) => {
    console.log(`🔄 Shard ${id} reconnecting...`);
});

client.on('shardResume', (id) => {
    console.log(`✅ Shard ${id} resumed`);
});

// ============================================
// START THE BOT
// ============================================
client.login(process.env.BOT_TOKEN);
