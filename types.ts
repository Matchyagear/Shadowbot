export interface Stock {
  ticker: string;
  companyName: string;
  matchScore: number;
  rationale: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  averageVolume: string;
  rsi: number;
  macdStatus: 'Bullish' | 'Bearish' | 'N/A';
  sparklineData: number[];
}