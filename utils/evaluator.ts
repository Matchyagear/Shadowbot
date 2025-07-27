import type { StockData, EvaluationResult } from '../types';

export const evaluateStock = (data: StockData): EvaluationResult => {
  const fails: string[] = [];
  
  // Trend: Price > 50MA and 50MA > 200MA. Price must also be above 200MA.
  const trend = data.price > data.fiftyDayMA && data.fiftyDayMA > data.twoHundredDayMA;
  if (!trend) fails.push("Trend");

  // Momentum: RSI > 50 and rising. We'll stick to RSI > 50 for simplicity.
  const momentum = data.rsi > 50;
  if (!momentum) fails.push("Momentum");

  // Volume: Relative Volume > 1.5.
  const relVol = data.avgVolume > 0 ? data.volume / data.avgVolume : 0;
  const volumeSufficient = relVol > 1.5;
  if (!volumeSufficient) fails.push("Volume");

  // Price Action: Price is near its recent high. Let's define "near" as within 5% of the high.
  const priceAction = data.price >= (data.recentHigh * 0.95);
  if (!priceAction) fails.push("PriceAction");
  
  const score = [trend, momentum, volumeSufficient, priceAction].filter(Boolean).length;
  
  return {
    trend,
    momentum,
    volumeSufficient,
    priceAction,
    score,
    fails,
  };
};