
import { GoogleGenAI, Type } from "@google/genai";
import type { RawStockData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    price: { type: Type.NUMBER, description: "Current trading price of the stock." },
    fiftyDayMA: { type: Type.NUMBER, description: "50-day moving average." },
    twoHundredDayMA: { type: Type.NUMBER, description: "200-day moving average." },
    rsi: { type: Type.NUMBER, description: "14-day Relative Strength Index (RSI)." },
    volume: { type: Type.NUMBER, description: "Current day's trading volume." },
    avgVolume: { type: Type.NUMBER, description: "Average daily trading volume over the last 30 days." },
    recentHigh: { type: Type.NUMBER, description: "The highest price in the last 20 trading days." },
    recentLow: { type: Type.NUMBER, description: "The lowest price in the last 20 trading days." },
  },
  required: ["price", "fiftyDayMA", "twoHundredDayMA", "rsi", "volume", "avgVolume", "recentHigh", "recentLow"]
};


export const fetchStockDataFromAI = async (ticker: string): Promise<RawStockData | null> => {
  try {
    const prompt = `Generate realistic, current financial market data for the stock ticker "${ticker}". The data should be plausible for today's market conditions. Ensure the moving averages are logically consistent with the current price. For example, in a strong uptrend, price > 50d MA > 200d MA.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText) as RawStockData;
    
    // Basic validation
    if (typeof data.price !== 'number' || data.price <= 0) {
        console.error(`Invalid data for ${ticker}:`, data);
        return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching AI data for ticker ${ticker}:`, error);
    return null;
  }
};
