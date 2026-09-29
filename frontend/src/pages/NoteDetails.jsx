import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Heart,
  Trash2,
  Calendar,
  Clock,
  Download,
  Share2,
} from 'lucide-react';
import { noteService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ConfirmModal } from '../components/Modal';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const data = await noteService.getNoteById(id);
        setNote(data);
      } catch (err) {
        showError('Note not found or unauthorized.');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {
    if (!note) return;
    try {
      const res = await noteService.toggleFavorite(note._id);
      showSuccess(res.message);
      setNote((prev) => ({ ...prev, favorite: res.favorite }));
    } catch (err) {
      showError('Failed to update favorite status');
    }
  };

  const handleDelete = async () => {
    try {
      await noteService.deleteNote(id);
      showSuccess('Note moved to trash');
      navigate('/notes');
    } catch (err) {
      showError('Failed to delete note');
    }
  };

  // Export note as .md file
  const handleExport = () => {
    if (!note) return;
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess('Exported note as Markdown file.');
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" message="Loading note contents..." />
      </div>
    );
  }

  if (!note) return null;

  const words = note.content ? note.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-[#263244]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Export */}
          <button
            onClick={handleExport}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title="Download as Markdown file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl transition-colors ${
              note.favorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : 'text-gray-500 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={note.favorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${note.favorite ? 'fill-current' : ''}`} />
          </button>

          {/* Edit */}
          <Link
            to={`/notes/${note._id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all duration-150 active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Note</span>
          </Link>

          {/* Delete */}
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reader Paper Layout */}
      <article className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-[#263244] p-6 sm:p-10 shadow-subtle space-y-6">
        {/* Category & Metadata */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {note.category}
            </span>

            {note.favorite && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <Heart className="w-3 h-3 fill-current" /> Favorite
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            {note.title}
          </h1>

          {/* Date & Read time */}
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 flex-wrap pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Updated {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span>~{readingTime} min read ({words} words)</span>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Content Body */}
        <div className="note-markdown whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200 text-base font-normal">
          {note.content}
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Move to Trash"
        message="Are you sure you want to move this note to Trash? You can restore it later if needed."
        confirmText="Move to Trash"
      />
    </div>
  );
};

export default NoteDetails;
