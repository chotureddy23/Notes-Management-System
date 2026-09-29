import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { noteService, categoryService } from '../services/api';
import { useToast } from '../context/ToastContext';
import NoteEditor from '../components/NoteEditor';
import LoadingSpinner from '../components/LoadingSpinner';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [note, setNote] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [noteData, categoriesData] = await Promise.all([
          noteService.getNoteById(id),
          categoryService.getCategories(),
        ]);
        setNote(noteData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load note for editing:', err);
        showError('Note not found or unauthorized.');
        navigate('/notes');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleUpdateNote = async (updatedData) => {
    try {
      setSaveLoading(true);
      await noteService.updateNote(id, updatedData);
      showSuccess('Note updated successfully.');
      navigate(`/notes/${id}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update note.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner message="Loading note editor..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Edit Note
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Make changes to "{note?.title}"
          </p>
        </div>
      </div>

      <NoteEditor
        initialData={note}
        categories={categories}
        onSave={handleUpdateNote}
        loading={saveLoading}
        isEdit={true}
      />
    </div>
  );
};

export default EditNote;
