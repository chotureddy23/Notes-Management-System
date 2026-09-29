import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { noteService } from '../services/api';
import { useToast } from '../context/ToastContext';
import NoteCard from '../components/NoteCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ConfirmModal } from '../components/Modal';

const Favorites = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const { showSuccess, showError } = useToast();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await noteService.getNotes({ favorite: 'true' });
      setNotes(res.notes || []);
    } catch (err) {
      showError('Failed to load favorite notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (noteId) => {
    try {
      const res = await noteService.toggleFavorite(noteId);
      showSuccess(res.message);
      // If unfavorited, remove from list
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
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
              Favorite Notes
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              {notes.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Quickly access the notes that matter most.
          </p>
        </div>
      </div>

      {/* Grid */}
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
          type="favorites"
          title="No favorite notes yet"
          description="Click the heart icon on any note card or inside the note editor to pin it here."
          actionText="Browse My Notes"
          actionLink="/notes"
        />
      )}

      {/* Confirm Delete Modal */}
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

export default Favorites;
