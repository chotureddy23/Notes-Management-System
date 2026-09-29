import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Programming':
      return { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800/40' };
    case 'Database':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800/40' };
    case 'AI & Machine Learning':
      return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800/40' };
    case 'Web Development':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/40' };
    case 'Mathematics':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/40' };
    case 'Science':
      return { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800/40' };
    case 'Personal':
      return { bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800/40' };
    default:
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' };
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const cleanContentSnippet = (content, maxLength = 130) => {
  if (!content) return '';
  // Strip Markdown symbols for a clean card snippet
  const cleaned = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s+/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned;
};

const NoteCard = ({
  note,
  onFavorite,
  onDelete,
  onRestore,
  isTrash = false,
  viewMode = 'grid',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const catStyle = getCategoryColor(note.category);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-[#263244] p-4 shadow-subtle hover:shadow-card-hover hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          {!isTrash && (
            <button
              onClick={() => onFavorite && onFavorite(note._id)}
              className={`p-2 rounded-lg transition-colors ${
                note.favorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={note.favorite ? 'Favorited' : 'Add to Favorites'}
            >
              <Heart className={`w-4 h-4 ${note.favorite ? 'fill-current' : ''}`} />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
              >
                {note.category}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(note.updatedAt || note.createdAt)}
              </span>
            </div>

            <Link
              to={isTrash ? '#' : `/notes/${note._id}`}
              className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block truncate"
            >
              {note.title}
            </Link>

            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {cleanContentSnippet(note.content, 180)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800 shrink-0">
          {note.tags && note.tags.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 flex-wrap">
              {note.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1">
            {isTrash ? (
              <>
                <button
                  onClick={() => onRestore && onRestore(note._id)}
                  className="p-1.5 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Restore note"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Restore</span>
                </button>
                <button
                  onClick={() => onDelete && onDelete(note._id, true)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Permanent Delete"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/notes/${note._id}`}
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Open Note"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  to={`/notes/${note._id}/edit`}
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Edit Note"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onDelete && onDelete(note._id, false)}
                  className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Move to Trash"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (Default)
  return (
    <div className="group relative bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] p-5 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Badge, Favorite, Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {note.category}
          </span>

          <div className="flex items-center gap-1">
            {!isTrash && (
              <button
                onClick={() => onFavorite && onFavorite(note._id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  note.favorite
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={note.favorite ? 'Favorited' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${note.favorite ? 'fill-current' : ''}`} />
              </button>
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#172033] rounded-xl border border-gray-200 dark:border-[#263244] shadow-lg py-1 z-20 animate-scale-in">
                  {!isTrash ? (
                    <>
                      <Link
                        to={`/notes/${note._id}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                        View Note
                      </Link>
                      <Link
                        to={`/notes/${note._id}/edit`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                        Edit Note
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          if (onDelete) onDelete(note._id, false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Move to Trash
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          if (onRestore) onRestore(note._id);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restore
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          if (onDelete) onDelete(note._id, true);
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Permanent Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <Link
          to={isTrash ? '#' : `/notes/${note._id}`}
          className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
        >
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-snug">
            {note.title}
          </h3>
        </Link>

        {/* Preview Snippet */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
          {cleanContentSnippet(note.content)}
        </p>
      </div>

      {/* Footer: Tags & Time */}
      <div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 self-center">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(note.updatedAt || note.createdAt)}
          </span>

          <Link
            to={isTrash ? '#' : `/notes/${note._id}`}
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isTrash ? 'In Trash' : 'Read Note →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
