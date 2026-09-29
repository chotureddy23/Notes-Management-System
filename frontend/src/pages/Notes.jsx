import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  LayoutGrid,
  List as ListIcon,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { noteService, categoryService } from '../services/api';
import { useToast } from '../context/ToastContext';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ConfirmModal } from '../components/Modal';

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [favoriteOnly, setFavoriteOnly] = useState(searchParams.get('favorite') === 'true');
  const [sort, setSort] = useState('recent');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('notes_view_mode') || 'grid');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // Sync viewMode preference
  const handleToggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('notes_view_mode', mode);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {
        sort,
      };
      if (category && category !== 'All') params.category = category;
      if (favoriteOnly) params.favorite = 'true';
      if (search && search.trim()) params.search = search.trim();

      const [notesRes, categoriesRes] = await Promise.all([
        noteService.getNotes(params),
        categoryService.getCategories(),
      ]);

      setNotes(notesRes.notes || []);
      setCategories(categoriesRes || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      showError('Failed to load notes from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [category, favoriteOnly, sort, search]);

  // Sync category param from URL if changed outside
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  const handleToggleFavorite = async (noteId) => {
    try {
      const res = await noteService.toggleFavorite(noteId);
      showSuccess(res.message);
      setNotes((prev) =>
        prev.map((n) => (n._id === noteId ? { ...n, favorite: res.favorite } : n))
      );
    } catch (err) {
      showError('Failed to update favorite status');
    }
  };

  const handleDeleteClick = (noteId) => {
    setDeleteModal({ open: true, id: noteId });
  };

  const confirmDeleteNote = async () => {
    try {
      await noteService.deleteNote(deleteModal.id);
      showSuccess('Note moved to trash');
      setDeleteModal({ open: false, id: null });
      setNotes((prev) => prev.filter((n) => n._id !== deleteModal.id));
    } catch (err) {
      showError('Failed to delete note');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              My Notes
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage, search, and organize all your notes in one place.
          </p>
        </div>

        <Link
          to="/notes/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </Link>
      </div>

      {/* Control Bar: Search, Category Filters, Sort, View Toggle */}
      <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Live Debounced Search Bar */}
          <div className="flex-1 max-w-md">
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setSearchParams((prev) => {
                  if (val) prev.set('q', val);
                  else prev.delete('q');
                  return prev;
                });
              }}
              placeholder="Search notes by title, tags, or content..."
            />
          </div>

          {/* Right Controls: Sort & Grid/List View Toggle */}
          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#172033] px-3 py-2 rounded-xl border border-gray-200 dark:border-[#263244]">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
              >
                <option value="recent">Recently Updated</option>
                <option value="created">Recently Created</option>
                <option value="title-asc">Title: A – Z</option>
                <option value="title-desc">Title: Z – A</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="flex items-center bg-gray-100 dark:bg-[#172033] p-1 rounded-xl border border-gray-200 dark:border-[#263244]">
              <button
                type="button"
                onClick={() => handleToggleViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Quick Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 dark:border-gray-800 pb-1 scrollbar-none">
          <button
            onClick={() => setCategory('All')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
              category === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-[#172033] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            All Categories
          </button>

          <button
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
              favoriteOnly
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-[#172033] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            Favorites Only
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id || cat.name}
              onClick={() => setCategory(cat.name)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                category === cat.name
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#172033] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color || '#4F46E5' }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid or List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : notes.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'space-y-3'
          }
        >
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              viewMode={viewMode}
              onFavorite={handleToggleFavorite}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type={search ? 'search' : favoriteOnly ? 'favorites' : 'notes'}
          title={search ? `No notes matching "${search}"` : undefined}
          actionText={search ? 'Clear Search' : 'Create New Note'}
          onAction={search ? () => setSearch('') : undefined}
          actionLink={search ? undefined : '/notes/create'}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={confirmDeleteNote}
        title="Move Note to Trash"
        message="Are you sure you want to move this note to Trash? You can restore it later from the Trash menu."
        confirmText="Move to Trash"
      />
    </div>
  );
};

export default Notes;
