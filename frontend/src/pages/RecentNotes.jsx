import React, { useState, useEffect } from 'react';
import { Clock3 } from 'lucide-react';
import { noteService } from '../services/api';
import { useToast } from '../context/ToastContext';
import NoteCard from '../components/NoteCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ConfirmModal } from '../components/Modal';

const RecentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const { showSuccess, showError } = useToast();

  const fetchRecent = async () => {
    try {
      setLoading(true);
      const res = await noteService.getNotes({ sort: 'recent', limit: 24 });
      setNotes(res.notes || []);
    } catch (err) {
      showError('Failed to load recent notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

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

  const handleDelete = (noteId) => {
    setDeleteModal({ open: true, id: noteId });
  };

  const confirmDelete = async () => {
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Recent Notes
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {notes.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Chronological log of notes you recently created or edited.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="notes"
          title="No recent activity"
          description="Create your first note to begin building your knowledge timeline."
          actionText="Create Note"
          actionLink="/notes/create"
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={confirmDelete}
        title="Move to Trash"
        message="This note will be moved to the Trash."
        confirmText="Move to Trash"
      />
    </div>
  );
};

export default RecentNotes;
