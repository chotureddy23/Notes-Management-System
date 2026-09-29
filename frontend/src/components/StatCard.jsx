import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  accentColor = 'indigo',
  trend,
  description,
  onClick,
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/50',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/50',
    },
  };

  const style = colorStyles[accentColor] || colorStyles.indigo;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] p-5 shadow-subtle hover:shadow-card-hover transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text} ${style.border} border`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-1.5">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            {trend}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">this month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
