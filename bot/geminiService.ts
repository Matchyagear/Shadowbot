import { GoogleGenerativeAI } from "@google/generative-ai";
import { Stock } from "../types";

const apiKey = process.env.VITE_API_KEY;
if (!apiKey) throw new Error("VITE_API_KEY not found in .env.local");

const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

export const evaluateTicker = async (ticker: string): Promise<Stock> => {
    try {
        const prompt = `
Strictly return ONLY valid JSON (no markdown or formatting) with all keys double-quoted.
Evaluate "${ticker.toUpperCase()}" against this swing trading strategy:

1. Trend (50MA > 200MA and price > both)
2. Momentum (RSI > 50, MACD > Signal)
3. Volume (Avg. vol > 1M, RelVol > 1.5)
4. Price Action (near breakout, not choppy)

Output format:
{
  "ticker": "AAPL",
  "companyName": "...",
  "currentPrice": 123.45,
  "priceChange": 1.23,
  "priceChangePercent": 1.01,
  "averageVolume": "2.3M",
  "rsi": 64,
  "macdStatus": "Bullish",
  "matchScore": 87,
  "rationale": "Explanation...",
  "sparklineData": [123.4, 123.5, ..., 124.1]
}
Only return the JSON object.
`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2
            }
        });

        const raw = await result.response.text();
        console.log("👁️ Gemini raw response:", raw);

        const clean = raw
            .replace(/^```json/, '')
            .replace(/^```/, '')
            .replace(/```$/, '')
            .trim();

        const parsed = JSON.parse(clean);
        if (!parsed.ticker) throw new Error("Gemini output missing required field: ticker");

        return parsed as Stock;

    } catch (err) {
        console.error(`❌ Error in evaluateTicker(${ticker}):`, err);
        throw new Error(`Gemini failed to evaluate ${ticker}.`);
    }
};
