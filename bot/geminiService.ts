import { GoogleGenAI, Type } from "@google/genai";
import { Stock } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stockSchemaProperties = {
    ticker: { type: Type.STRING, description: "The stock ticker symbol, e.g., AAPL." },
    companyName: { type: Type.STRING, description: "The full name of the company." },
    currentPrice: { type: Type.NUMBER, description: "The current or last closing stock price." },
    priceChange: { type: Type.NUMBER, description: "The dollar change in price for the day." },
    priceChangePercent: { type: Type.NUMBER, description: "The percentage change in price for the day." },
    averageVolume: { type: Type.STRING, description: "The 30-day average trading volume, formatted as a string (e.g., '1.5M', '10.2M')." },
    rsi: { type: Type.INTEGER, description: "The current 14-day Relative Strength Index (RSI) value." },
    macdStatus: { type: Type.STRING, enum: ['Bullish', 'Bearish', 'N/A'], description: "The MACD status: 'Bullish' if MACD line > signal line, otherwise 'Bearish'." },
    matchScore: { type: Type.INTEGER, description: "A score from 1 to 100 indicating how well the stock fits all criteria." },
    rationale: { type: Type.STRING, description: "A brief, 1-2 sentence explanation of why this stock is a strong candidate." },
    sparklineData: {
        type: Type.ARRAY,
        description: "An array of 24 numbers representing the price points for a 1-day sparkline chart.",
        items: { type: Type.NUMBER }
    }
};

const requiredFields = ["ticker", "companyName", "currentPrice", "priceChange", "priceChangePercent", "averageVolume", "rsi", "macdStatus", "matchScore", "rationale", "sparklineData"];

const singleResponseSchema = {
    type: Type.OBJECT,
    properties: stockSchemaProperties,
    required: requiredFields,
};


export const evaluateTicker = async (ticker: string): Promise<Stock> => {
    try {
        const prompt = `
            Perform a detailed analysis of the stock with the ticker symbol "${ticker.toUpperCase()}" based on the rigorous swing trading strategy provided below.
            Your task is to evaluate how well this specific stock meets each criterion and provide a comprehensive summary.
            Even if the stock is a poor match, you must still provide the analysis and all requested data points.

            **Swing Trading Strategy Criteria to Evaluate Against:**
            1.  **Trend Confirmation:** Is the 50-day MA > 200-day MA (Golden Cross)? Is the current price > both MAs?
            2.  **Momentum:** Is the RSI(14) > 50? Is the MACD line > the MACD Signal line?
            3.  **Volume:** Is the average daily volume > 1 million shares? Is the Relative Volume (RelVol) > 1.5?
            4.  **Price Action:** Is the price near its 52-week high or breaking out? Is it in choppy price action?

            Based on your analysis, provide a "matchScore" from 1-100 and a "rationale" explaining its strengths and weaknesses against the strategy.

            You MUST return a single JSON object with the following structure, providing all data points:
            - **ticker**: The stock ticker symbol.
            - **companyName**: The full company name.
            - **currentPrice**: The current or last closing stock price.
            - **priceChange**: The dollar change for the day.
            - **priceChangePercent**: The percentage change for the day.
            - **averageVolume**: The 30-day average volume as a formatted string (e.g., '2.1M').
            - **rsi**: The current 14-day RSI value.
            - **macdStatus**: 'Bullish', 'Bearish' or 'N/A'.
            - **matchScore**: Your calculated score (1-100).
            - **rationale**: Your detailed explanation.
            - **sparklineData**: An array of exactly 24 numbers representing the price points for a 1-day chart.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleResponseSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (!parsedData.ticker) {
            throw new Error("AI response was missing required fields.");
        }
        
        return parsedData as Stock;

    } catch (error) {
        console.error(`Error evaluating ticker ${ticker} from Gemini API:`, error);
        throw new Error(`Failed to get a valid AI evaluation for ${ticker}. Please try again.`);
    }
};
