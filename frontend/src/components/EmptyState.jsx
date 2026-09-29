import React from 'react';
import { FileText, Heart, Trash2, FolderPlus, SearchX, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  type = 'notes',
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'favorites':
        return <Heart className="w-8 h-8 text-rose-500" />;
      case 'trash':
        return <Trash2 className="w-8 h-8 text-amber-500" />;
      case 'search':
        return <SearchX className="w-8 h-8 text-blue-500" />;
      case 'categories':
        return <FolderPlus className="w-8 h-8 text-purple-500" />;
      default:
        return <FileText className="w-8 h-8 text-indigo-500" />;
    }
  };

  const defaultTitles = {
    notes: 'No notes found',
    favorites: 'No favorite notes yet',
    trash: 'Trash is empty',
    search: 'No matching notes found',
    categories: 'No categories created',
  };

  const defaultDescriptions = {
    notes: 'Create your first note and start organizing your knowledge.',
    favorites: 'Star important notes to access them quickly from here.',
    trash: 'Items you delete will be kept here for recovery or permanent deletion.',
    search: 'Try adjusting your search terms or filters to find what you need.',
    categories: 'Group your notes into custom subjects and categories.',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle my-6 max-w-lg mx-auto animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title || defaultTitles[type] || 'No items available'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description || defaultDescriptions[type] || ''}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </Link>
      )}

      {actionText && !actionLink && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
