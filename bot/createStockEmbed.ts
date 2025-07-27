import { EmbedBuilder } from 'discord.js';
import { Stock } from '../types';

export const createStockEmbed = (stock: Stock): EmbedBuilder => {
    const { 
        ticker,
        companyName,
        matchScore,
        rationale,
        currentPrice,
        priceChange,
        priceChangePercent,
        averageVolume,
        rsi,
        macdStatus
    } = stock;

    const priceChangeSign = priceChange >= 0 ? '+' : '';
    const priceChangeString = `${priceChangeSign}${priceChange.toFixed(2)} (${priceChangeSign}${priceChangePercent.toFixed(2)}%)`;
    const embedColor = priceChange >= 0 ? 0x22c55e : 0xef4444; // Green-500 or Red-500

    const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`📈 ${companyName} (${ticker})`)
        .setURL(`https://finance.yahoo.com/quote/${ticker}`)
        .setDescription(rationale)
        .setFields(
            { name: 'Match Score', value: `**${matchScore}%**`, inline: true },
            { name: 'Current Price', value: `**$${currentPrice.toFixed(2)}**`, inline: true },
            { name: 'Day Change', value: priceChangeString, inline: true },
            { name: 'Avg Volume', value: averageVolume, inline: true },
            { name: 'RSI (14)', value: rsi.toFixed(1), inline: true },
            { name: 'MACD Status', value: macdStatus, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'AI Stock Screener Bot' });

    return embed;
};
