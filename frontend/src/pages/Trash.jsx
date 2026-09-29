import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { noteService } from '../services/api';
import { useToast } from '../context/ToastContext';
import NoteCard from '../components/NoteCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ConfirmModal } from '../components/Modal';

const Trash = () => {
  const [trashNotes, setTrashNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Modal states
  const [emptyTrashModal, setEmptyTrashModal] = useState(false);
  const [permDeleteModal, setPermDeleteModal] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTrashNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getTrashNotes();
      setTrashNotes(data.notes || []);
    } catch (err) {
      showError('Failed to load trash items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashNotes();
  }, []);

  const handleRestore = async (noteId) => {
    try {
      await noteService.restoreNote(noteId);
      showSuccess('Note restored successfully.');
      setTrashNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      showError('Failed to restore note.');
    }
  };

  const handlePermanentDeleteClick = (noteId) => {
    setPermDeleteModal({ open: true, id: noteId });
  };

  const confirmPermanentDelete = async () => {
    try {
      setActionLoading(true);
      await noteService.permanentDeleteNote(permDeleteModal.id);
      showSuccess('Note permanently deleted.');
      setPermDeleteModal({ open: false, id: null });
      setTrashNotes((prev) => prev.filter((n) => n._id !== permDeleteModal.id));
    } catch (err) {
      showError('Failed to permanently delete note.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setActionLoading(true);
      const res = await noteService.emptyTrash();
      showSuccess(res.message || 'Trash emptied successfully.');
      setEmptyTrashModal(false);
      setTrashNotes([]);
    } catch (err) {
      showError('Failed to empty trash.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Trash
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              {trashNotes.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Items in trash can be restored or permanently removed from MongoDB.
          </p>
        </div>

        {trashNotes.length > 0 && (
          <button
            onClick={() => setEmptyTrashModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Trash</span>
          </button>
        )}
      </div>

      {/* Trash Warning Banner */}
      {trashNotes.length > 0 && (
        <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Notes in trash are preserved until you choose to permanently purge them. Restoring a note brings back its full tags, category, and timestamps.
          </span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : trashNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trashNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              isTrash={true}
              onRestore={handleRestore}
              onDelete={handlePermanentDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="trash"
          title="Trash is clean"
          description="You have no deleted notes in your recycle bin."
          actionText="Back to Notes"
          actionLink="/notes"
        />
      )}

      {/* Permanent Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={permDeleteModal.open}
        onClose={() => setPermDeleteModal({ open: false, id: null })}
        onConfirm={confirmPermanentDelete}
        title="Permanently Delete Note"
        message="This action cannot be undone. This document will be completely purged from the MongoDB database."
        confirmText="Purge Forever"
        loading={actionLoading}
      />

      {/* Empty Trash Confirmation Modal */}
      <ConfirmModal
        isOpen={emptyTrashModal}
        onClose={() => setEmptyTrashModal(false)}
        onConfirm={handleEmptyTrash}
        title="Empty Entire Trash"
        message={`Are you sure you want to permanently delete all ${trashNotes.length} notes in your trash? This operation is irreversible.`}
        confirmText="Empty Trash Now"
        loading={actionLoading}
      />
    </div>
  );
};

export default Trash;
