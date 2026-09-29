import React from 'react';
import {
  Folder,
  Code,
  Database,
  Globe,
  Cpu,
  Calculator,
  Atom,
  User,
  Terminal,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Code,
  Database,
  Globe,
  Cpu,
  Calculator,
  Atom,
  User,
  Terminal,
  Folder,
  FileText,
};

const CategoryCard = ({ category, onEdit, onDelete }) => {
  const IconComponent = iconMap[category.icon] || Folder;
  const accentColor = category.color || '#4F46E5';

  return (
    <div className="group relative bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] p-5 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              borderColor: `${accentColor}30`,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(category)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Edit Category"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(category)}
                className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <Link
          to={`/notes?category=${encodeURIComponent(category.name)}`}
          className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        >
          <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            {category.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[32px]">
            {category.description || `Notes filed under ${category.name}`}
          </p>
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {category.noteCount || 0} {category.noteCount === 1 ? 'note' : 'notes'}
        </span>
        <Link
          to={`/notes?category=${encodeURIComponent(category.name)}`}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Notes →
        </Link>
      </div>
    </div>
  );
};

export default CategoryCard;
