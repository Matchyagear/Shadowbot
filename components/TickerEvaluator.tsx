import React, { useState } from 'react';
import { Stock } from '../types';
import { evaluateTicker } from '../services/geminiService';
import StockCard from './StockCard';
import ErrorMessage from './ErrorMessage';

const TickerEvaluator: React.FC = () => {
    const [ticker, setTicker] = useState('');
    const [result, setResult] = useState<Stock | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEvaluation = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!ticker.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const evaluationResult = await evaluateTicker(ticker.trim().toUpperCase());
            setResult(evaluationResult);
            setTicker('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during evaluation.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/50 rounded-lg shadow-lg p-6 border border-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-white">Evaluate a Ticker</h3>
            <form onSubmit={handleEvaluation} className="flex items-center gap-2">
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="e.g., AAPL"
                    className="flex-grow bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Stock Ticker"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading || !ticker.trim()}
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                    aria-live="polite"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Evaluate'}
                </button>
            </form>
            
            <div className="mt-4 min-h-[1rem]">
                {error && <ErrorMessage message={error} onRetry={handleEvaluation} />}
                {result && !error && (
                    <div className="mt-4 animate-fade-in">
                       <StockCard stock={result} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TickerEvaluator;