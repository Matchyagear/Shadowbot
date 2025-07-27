import React from 'react';
import type { StockRowData } from '../types';
import { DataStatus } from '../types';
import { StarIcon, XCircleIcon, Spinner } from './Icons';

interface StockTableProps {
  title: string;
  stocks: StockRowData[];
  status: DataStatus;
}

const ScoreLabel = ({ score }: { score: number }) => (
  <div className="flex items-center justify-center space-x-2">
    <span className="font-mono">{score}/4</span>
    <div className="flex">
      {[...Array(4)].map((_, i) => (
        <StarIcon key={i} className={i < score ? 'text-yellow-400' : 'text-gray-600'} />
      ))}
    </div>
    {score < 3 && <XCircleIcon className="text-red-500" />}
  </div>
);

const BooleanCell = ({ value }: { value: boolean }) => (
  <span className={`px-2 py-1 text-xs font-bold rounded-full ${value ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
    {value ? 'TRUE' : 'FALSE'}
  </span>
);

const HeaderCell = ({ children }: { children: React.ReactNode }) => (
  <th className="p-3 text-sm font-semibold tracking-wide text-left sticky top-0 bg-gray-700 z-10">{children}</th>
);

const DataCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`p-3 text-sm text-gray-300 ${className}`}>{children}</td>
);

const StockTableRow = ({ item }: { item: StockRowData }) => {
  const relVol = item.avgVolume > 0 ? (item.volume / item.avgVolume).toFixed(2) : '0.00';
  return (
    <tr className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
      <DataCell className="font-bold text-sky-400">{item.ticker}</DataCell>
      <DataCell><ScoreLabel score={item.score} /></DataCell>
      <DataCell className="text-center">{item.rank ?? '-'}</DataCell>
      <DataCell className="text-center"><BooleanCell value={item.trend} /></DataCell>
      <DataCell className="text-center"><BooleanCell value={item.momentum} /></DataCell>
      <DataCell className="text-center"><BooleanCell value={item.priceAction} /></DataCell>
      <DataCell className="text-center"><BooleanCell value={item.volumeSufficient} /></DataCell>
      <DataCell className="text-xs text-red-400">{item.fails.join(', ')}</DataCell>
      <DataCell className="text-right font-mono">${item.price.toFixed(2)}</DataCell>
      <DataCell className="text-right font-mono">${item.fiftyDayMA.toFixed(2)}</DataCell>
      <DataCell className="text-right font-mono">${item.twoHundredDayMA.toFixed(2)}</DataCell>
      <DataCell className="text-right font-mono">{item.rsi.toFixed(2)}</DataCell>
      <DataCell className="text-right font-mono">{relVol}</DataCell>
      <DataCell className="text-right font-mono">${item.recentHigh.toFixed(2)}</DataCell>
    </tr>
  );
};

export const StockTable = ({ title, stocks, status }: StockTableProps) => {
    return (
        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden my-6">
            <h2 className="text-xl font-bold p-4 bg-gray-700 text-gray-200 border-b border-gray-600">{title}</h2>
            <div className="overflow-x-auto max-h-[40vh] relative">
                <table className="w-full">
                    <thead className="text-gray-300">
                        <tr>
                            <HeaderCell>Ticker</HeaderCell>
                            <HeaderCell>ScoreLabel</HeaderCell>
                            <HeaderCell>Rank</HeaderCell>
                            <HeaderCell>Trend</HeaderCell>
                            <HeaderCell>Momentum</HeaderCell>
                            <HeaderCell>PriceAction</HeaderCell>
                            <HeaderCell>Sufficient Volume</HeaderCell>
                            <HeaderCell>Fails</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            <HeaderCell>50_MA</HeaderCell>
                            <HeaderCell>200_MA</HeaderCell>
                            <HeaderCell>RSI</HeaderCell>
                            <HeaderCell>RelVol</HeaderCell>
                            <HeaderCell>RecentHigh</HeaderCell>
                        </tr>
                    </thead>
                    <tbody>
                        {status === DataStatus.Loading && (
                            <tr>
                                <td colSpan={14}><Spinner /></td>
                            </tr>
                        )}
                        {status !== DataStatus.Loading && stocks.length === 0 && (
                            <tr>
                                <td colSpan={14} className="text-center p-6 text-gray-500">No stocks to display.</td>
                            </tr>
                        )}
                        {status !== DataStatus.Loading && stocks.map((item) => (
                           <StockTableRow key={item.ticker} item={item} />
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="bg-gray-900/50 p-3 border-t border-gray-700">
                <h3 className="text-sm font-semibold mb-2">Criteria Definitions:</h3>
                <ul className="text-xs text-gray-400 space-y-1">
                    <li><span className="font-bold text-gray-300">Trend:</span> Price &gt; 50MA &gt; 200MA</li>
                    <li><span className="font-bold text-gray-300">Momentum:</span> RSI &gt; 50</li>
                    <li><span className="font-bold text-gray-300">PriceAction:</span> Price is within 5% of recent high</li>
                    <li><span className="font-bold text-gray-300">Sufficient Volume:</span> Relative Volume &gt; 1.5</li>
                </ul>
            </div>
        </div>
    );
};