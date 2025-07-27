import React from 'react';
import Papa from 'papaparse';

type Props = {
  onLoad: (tickers: string[]) => void;
};

export function WatchlistImporter({ onLoad }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<string[]>(file, {
      complete: (result) => {
        const tickers = result.data
          .map((row) => row[0]?.trim().toUpperCase())
          .filter((t) => !!t);
        onLoad(tickers);
      },
      header: false,
    });
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-300 mb-1">
        Reload Your TradingView Watchlist (CSV):
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="text-sm text-gray-200"
      />
    </div>
  );
}
