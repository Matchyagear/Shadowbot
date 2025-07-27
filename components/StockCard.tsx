import React from 'react';
import { Stock } from '../types';
import SparklineChart from './SparklineChart';

interface StockCardProps {
  stock: Stock;
  rank?: number;
}

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (value: number) => {
        if (value >= 85) return 'bg-teal-500';
        if (value >= 70) return 'bg-cyan-500';
        return 'bg-blue-500';
    };

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-indigo-300">Match Score</span>
                <span className={`text-sm font-medium text-white`}>{score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className={`${getScoreColor(score)} h-2.5 rounded-full transition-all duration-500`} 
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};


const StockCard: React.FC<StockCardProps> = ({ stock, rank }) => {
  const priceChangeColor = stock.priceChange >= 0 ? 'text-green-400' : 'text-red-400';
  const formattedPriceChange = stock.priceChange >= 0 ? `+${stock.priceChange.toFixed(2)}` : stock.priceChange.toFixed(2);

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transition-transform hover:scale-105 hover:border-indigo-500">
        <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="font-bold text-lg text-white truncate pr-2" title={stock.companyName}>{stock.companyName}</div>
                    <div className="text-sm font-mono text-indigo-300">{stock.ticker}</div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="text-xl font-semibold text-white">${stock.currentPrice.toFixed(2)}</div>
                    <div className={`text-sm font-medium ${priceChangeColor}`}>
                        {formattedPriceChange} ({stock.priceChangePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>

            <div className="mb-4">
              <SparklineChart data={stock.sparklineData} priceChange={stock.priceChange} />
            </div>

            <div className="mb-4">
                <ScoreBar score={stock.matchScore} />
            </div>

            <div className="text-sm text-gray-400 space-y-2 mb-4">
                <div className="flex justify-between">
                    <span>Avg. Volume:</span>
                    <span className="font-medium text-gray-300">{stock.averageVolume}</span>
                </div>
                <div className="flex justify-between">
                    <span>RSI (14):</span>
                    <span className="font-medium text-gray-300">{stock.rsi.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                    <span>MACD:</span>
                    <span className={`font-medium ${stock.macdStatus === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>{stock.macdStatus}</span>
                </div>
            </div>

            <div className="flex-grow">
                <h4 className="text-sm font-semibold text-gray-400 mb-1">AI Rationale</h4>
                <p className="text-sm text-gray-300">
                    {stock.rationale}
                </p>
            </div>
        </div>
        {rank && (
            <div className="bg-gray-800 rounded-b-lg px-5 py-3 border-t border-gray-700 mt-4">
                <div className="flex items-center text-indigo-300">
                    <span className="text-2xl font-bold">#{rank}</span>
                    <span className="ml-2 text-sm font-medium">Rank</span>
                </div>
            </div>
        )}
    </div>
  );
};

export default StockCard;