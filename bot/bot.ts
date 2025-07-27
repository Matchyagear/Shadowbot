import process from 'node:process';

// This needs to be run in a separate process, e.g., `node bot/bot.js`
// Make sure to install dependencies: npm install discord.js dotenv

require('dotenv').config({ path: require('node:path').resolve(process.cwd(), '.env') });
import { Client, GatewayIntentBits, Events, Message } from 'discord.js';
import { evaluateTicker } from './geminiService';
import { createStockEmbed } from './createStockEmbed';

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    throw new Error("DISCORD_BOT_TOKEN not found in .env file.");
}
if (!process.env.API_KEY) {
    throw new Error("API_KEY for Gemini not found in .env file.");
}


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once(Events.ClientReady, c => {
    console.log(`Bot is online! Logged in as ${c.user.tag}`);
});

const COMMAND_PREFIX = '!eval';

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)) {
        return;
    }

    const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
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
});


client.login(token);