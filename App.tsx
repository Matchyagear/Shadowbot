import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StockTable } from './components/StockTable';
import { fetchStockDataFromAI } from './services/geminiService';
import { evaluateStock } from './utils/evaluator';
import { YOUR_INITIAL_PICKS } from './constants';
import { DataStatus } from './types';
import type { StockRowData } from './types';
import { WatchlistImporter } from './components/WatchlistImporter';

const App = () => {
  const [myPicks, setMyPicks] = useState<StockRowData[]>([]);
  const [myPicksStatus, setMyPicksStatus] = useState<DataStatus>(DataStatus.Idle);
  const [newTicker, setNewTicker] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ——— WATCHLIST STATE ———
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('myWatchlist');
      return saved ? JSON.parse(saved) : YOUR_INITIAL_PICKS;
    } catch {
      return YOUR_INITIAL_PICKS;
    }
  });

  // persist whenever watchlist changes
  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const processTickers = useCallback(async (tickers: string[], currentPicks: StockRowData[]): Promise<StockRowData[]> => {
    const newPicks = [...currentPicks];
    const newTickersToFetch = tickers.filter(t => !currentPicks.some(p => p.ticker === t.toUpperCase()));
    
    for (const ticker of newTickersToFetch) {
        const upperCaseTicker = ticker.toUpperCase();
        setError(null);
        const rawData = await fetchStockDataFromAI(upperCaseTicker);
        if (rawData) {
            const evaluation = evaluateStock({ ...rawData, ticker: upperCaseTicker });
            newPicks.push({
                ...rawData,
                ticker: upperCaseTicker,
                ...evaluation,
                rank: null, // Rank will be calculated later
            });
        } else {
            setError(`Failed to fetch data for ${upperCaseTicker}. Please try another ticker.`);
        }
    }
    
    // Sort and rank all picks
    const sortedPicks = newPicks.sort((a, b) => b.score - a.score);
    return sortedPicks.map((pick, index) => ({ ...pick, rank: index + 1 }));
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setMyPicksStatus(DataStatus.Loading);
      const processedPicks = await processTickers(YOUR_INITIAL_PICKS, []);
      setMyPicks(processedPicks);
      setMyPicksStatus(DataStatus.Success);
    };
    
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlist]); // Only run once on mount

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker || myPicks.some(p => p.ticker === newTicker.toUpperCase())) {
      setNewTicker('');
      return;
    }
    setMyPicksStatus(DataStatus.Loading);
    const updatedPicks = await processTickers([newTicker], myPicks);
    setMyPicks(updatedPicks);
    setMyPicksStatus(DataStatus.Success);
    setNewTicker('');
  };
  
  const shadowsPicks = useMemo(() => {
    return myPicks
      .filter(p => p.score >= 3) // Shadow only considers strong picks
      .slice(0, 5); // Take top 5 of the strong picks
  }, [myPicks]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            AI Stock Cheat Sheet
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Your personalized stock dashboard powered by Gemini
          </p>
        </header>

        {/* 1-Click CSV importer for your TradingView watchlist */}
        <WatchlistImporter onLoad={setWatchlist} />

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <form onSubmit={handleAddTicker} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="Add a stock ticker (e.g., AAPL)"
              className="flex-grow bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={myPicksStatus === DataStatus.Loading}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {myPicksStatus === DataStatus.Loading ? 'Analyzing...' : 'Add Ticker'}
            </button>
          </form>
          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>

        <StockTable title="Your Picks" stocks={myPicks} status={myPicksStatus} />
        <StockTable title="Shadow's Picks (Top Performers)" stocks={shadowsPicks} status={myPicksStatus} />
        
        <footer className="text-center text-gray-500 mt-12 text-sm">
            <p>Data generated by Google Gemini. Not financial advice. For educational purposes only.</p>
            <p>© {new Date().getFullYear()} AI Stock Cheat Sheet</p>
        </footer>
      </div>
    </div>
  );
};

export default App;