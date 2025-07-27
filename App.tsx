import React, { useState, useEffect, useCallback } from 'react';
import { Stock } from './types';
import { fetchStockIdeas } from './services/geminiService';
import Header from './components/Header';
import CriteriaPanel from './components/CriteriaPanel';
import StockCard from './components/StockCard';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import TickerEvaluator from './components/TickerEvaluator';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runScan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stockIdeas = await fetchStockIdeas();
      setStocks(stockIdeas);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleSaveSnapshot = async () => {
    if (stocks.length === 0 || isSaving) return;
    setIsSaving(true);
    try {
      const result = await window.electronAPI.saveSnapshot(stocks);
      if (result.success) {
        alert(`Snapshot saved successfully to: ${result.path}`);
      } else {
        alert(`Error saving snapshot: ${result.error}`);
      }
    } catch(err) {
      console.error("Snapshot save error:", err);
      alert("Failed to save snapshot. Ensure you have permissions to write to the Google Drive folder.");
    } finally {
      setIsSaving(false);
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorMessage message={error} onRetry={runScan} />;
    }
    if (stocks.length === 0) {
      return (
        <div className="text-center py-12 px-4">
          <div className="mx-auto w-24 h-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 13.5h-6" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white">No Matching Stocks Found</h3>
          <p className="mt-1 text-sm text-gray-400">
            The AI couldn't find any stocks on the NYSE that currently match your strategy. Market conditions may be unfavorable.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={runScan}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201-4.42 5.5 5.5 0 011.66-1.991A5.5 5.5 0 0112.5 3a5.5 5.5 0 012.812 8.424zM16.5 15.5a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM12.5 5a.75.75 0 000 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
                <path d="M4.12 7.336A5.485 5.485 0 013 9.25a5.5 5.5 0 01-2.072.502.75.75 0 00-.638 1.25 7.001 7.001 0 006.015 4.177.75.75 0 00.779-.623A5.502 5.502 0 015.5 6.25a5.486 5.486 0 01-1.38-.214z" />
              </svg>
              Scan Again
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {stocks.map((stock, index) => (
          <StockCard key={stock.ticker} stock={stock} rank={index + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onScan={runScan} onSaveSnapshot={handleSaveSnapshot} isScanning={isLoading} isSaving={isSaving} hasStocks={stocks.length > 0} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8 sticky top-24">
            <TickerEvaluator />
            <CriteriaPanel />
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-4">Top AI-Screened Stocks</h2>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
