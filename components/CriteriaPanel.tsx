
import React from 'react';
import { TRADING_CRITERIA } from '../constants';

const CriteriaPanel: React.FC = () => {
    return (
        <div className="bg-gray-800/50 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Your Swing Trading Setup</h3>
            <ul className="space-y-4">
                {TRADING_CRITERIA.map((criterion) => (
                    <li key={criterion.name} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                            {criterion.icon}
                        </div>
                        <div>
                            <p className="text-md font-medium text-white">{criterion.name}</p>
                            <ul className="list-disc list-inside text-sm text-gray-400 mt-1">
                                {criterion.rules.map((rule) => (
                                    <li key={rule}>{rule}</li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CriteriaPanel;
