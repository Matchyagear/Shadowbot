export interface RawStockData {
  price: number;
  fiftyDayMA: number;
  twoHundredDayMA: number;
  rsi: number;
  volume: number;
  avgVolume: number;
  recentHigh: number;
  recentLow: number;
}

export interface StockData extends RawStockData {
  ticker: string;
}

export interface EvaluationResult {
  trend: boolean;
  momentum: boolean;
  volumeSufficient: boolean;
  priceAction: boolean;
  score: number;
  fails: string[];
}

export interface StockRowData extends StockData, EvaluationResult {
  rank: number | null;
}

export enum DataStatus {
  Idle,
  Loading,
  Success,
  Error,
}