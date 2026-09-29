import React from 'react';

export const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin`}
      />
      {message && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-200 dark:border-[#263244] animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );
};

export const SkeletonStat = () => {
  return (
    <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-200 dark:border-[#263244] animate-pulse flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
    </div>
  );
};

export default LoadingSpinner;
