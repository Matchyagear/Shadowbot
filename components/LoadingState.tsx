
import React from 'react';

const SkeletonCard: React.FC = () => (
    <div className="bg-gray-800/50 rounded-lg shadow-lg border border-gray-700 p-5 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="h-5 bg-gray-700 rounded-full w-14"></div>
        </div>
        <div className="mt-4 mb-4">
            <div className="flex justify-between mb-2">
                 <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                 <div className="h-4 bg-gray-700 rounded w-1/6"></div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5"></div>
        </div>
        <div>
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="mt-5 border-t border-gray-700 pt-3">
             <div className="h-8 bg-gray-700 rounded w-1/5"></div>
        </div>
    </div>
);

const LoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default LoadingState;
