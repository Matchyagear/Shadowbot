
import React from 'react';

const TrendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const MomentumIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const VolumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

const PriceActionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);


export const TRADING_CRITERIA = [
    {
        name: "Trend",
        icon: <TrendIcon />,
        rules: [
            "50-day MA > 200-day MA (Golden Cross)",
            "Price is above both MAs"
        ]
    },
    {
        name: "Momentum",
        icon: <MomentumIcon />,
        rules: [
            "RSI (14) > 50",
            "MACD line > Signal line"
        ]
    },
    {
        name: "Volume",
        icon: <VolumeIcon />,
        rules: [
            "Average volume > 1M shares",
            "Relative Volume (RelVol) > 1.5"
        ]
    },
    {
        name: "Price Action",
        icon: <PriceActionIcon />,
        rules: [
            "Price near recent highs or breaking out",
            "Avoid low-volume chop"
        ]
    }
];
