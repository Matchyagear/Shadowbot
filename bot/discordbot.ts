require('dotenv').config({ path: require('node:path').resolve(require('node:process').cwd(), '.env.local') });

import { Client, GatewayIntentBits, Events, Message, TextChannel } from 'discord.js';
import { evaluateTicker } from './geminiService';
import { createStockEmbed } from './createStockEmbed';

const token = process.env.VITE_DISCORD_BOT_TOKEN;
const apiKey = process.env.VITE_API_KEY;

if (!token) throw new Error("VITE_DISCORD_BOT_TOKEN not found in .env.local");
if (!apiKey) throw new Error("VITE_API_KEY for Gemini not found in .env.local");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const EVAL_COMMAND = "!eval";
const ROAST_COMMAND = "!roastjarrod";
const JARROD_TAG = "@jarrodlington";

const roasts = [
    "you absolute indicator lag. Even your RSI needs therapy. 🫵📉",
    "you're so bearish you make the VIX blush.",
    "you're like a MACD cross — late, confusing, and wrong half the time.",
    "you trade like you’re still on dial-up.",
    "even ChatGPT couldn’t predict how mid your setups are.",
    "you're like a penny stock. Loud, volatile, and going nowhere.",
    "you’re the reason people FOMO into red candles."
];

client.once(Events.ClientReady, (c) => {
    console.log(`🤖 ShadowBot is online! Logged in as ${c.user.tag}`);

    const sendRoast = () => {
        const channel = client.channels.cache.find(
            (ch) =>
                ch.isTextBased?.() &&
                ch.type === 0 &&
                ch.name.toLowerCase() === "general"
        ) as TextChannel | undefined;

        if (!channel) {
            console.error("⚠️ Could not find #general text channel.");
            return;
        }

        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        const message = `${JARROD_TAG}, ${roast}`;

        channel.send(message).catch((err) => {
            console.error("Failed to send roast:", err);
        });
    };

    // First roast immediately
    sendRoast();

    // Roast every hour
    setInterval(sendRoast, 60 * 60 * 1000);
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // Handle !eval [TICKER]
    if (content.startsWith(EVAL_COMMAND)) {
        if (!message.inGuild()) return;

        const args = message.content.slice(EVAL_COMMAND.length).trim().split(/ +/);
        const ticker = args[0]?.toUpperCase();

        if (!ticker) {
            await message.reply("Please provide a stock ticker. Usage: `!eval AAPL`");
            return;
        }

        try {
            await message.channel.sendTyping();
            const stockData = await evaluateTicker(ticker);
            const embed = createStockEmbed(stockData);
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error evaluating ticker ${ticker}:`, error);
            await message.reply(`I couldn't get an evaluation for **${ticker}**. It might be an invalid ticker or there was an API error.`);
        }
    }

    // Handle !roastjarrod
    if (content === ROAST_COMMAND) {
        const roast = roasts[Math.floor(Math.random() * roasts.length)];
        await message.reply(`${JARROD_TAG}, ${roast}`);
    }
});

client.login(token);
