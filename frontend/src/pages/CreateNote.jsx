import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { noteService, categoryService } from '../services/api';
import { useToast } from '../context/ToastContext';
import NoteEditor from '../components/NoteEditor';

const CreateNote = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleSaveNote = async (noteData) => {
    try {
      setLoading(true);
      await noteService.createNote(noteData);
      showSuccess('Note created successfully.');
      navigate('/notes');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Create Note
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Write ideas, documentation, code snippets, or lecture insights.
          </p>
        </div>
      </div>

      <NoteEditor
        categories={categories}
        onSave={handleSaveNote}
        loading={loading}
        isEdit={false}
      />
    </div>
  );
};

export default CreateNote;
