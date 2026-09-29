import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Heart,
  Folder,
  Activity,
  Plus,
  ArrowRight,
  Upload,
  FolderPlus,
  Star,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dashboardService, noteService, categoryService } from '../services/api';
import StatCard from '../components/StatCard';
import NoteCard from '../components/NoteCard';
import { SkeletonStat, SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Modal, ConfirmModal } from '../components/Modal';

const Dashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // Quick Category creation modal from dashboard
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#4F46E5');
  const [catLoading, setCatLoading] = useState(false);

  // Quick note upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('Programming');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, categoriesData] = await Promise.all([
        dashboardService.getStats(),
        categoryService.getCategories(),
      ]);
      setStats(statsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Toggle favorite
  const handleToggleFavorite = async (noteId) => {
    try {
      const res = await noteService.toggleFavorite(noteId);
      showSuccess(res.message);
      // Update local state
      setStats((prev) => ({
        ...prev,
        favoriteNotes: res.favorite ? prev.favoriteNotes + 1 : Math.max(0, prev.favoriteNotes - 1),
        recentNotes: prev.recentNotes.map((n) =>
          n._id === noteId ? { ...n, favorite: res.favorite } : n
        ),
      }));
    } catch (err) {
      showError('Failed to update favorite status.');
    }
  };

  // Move to trash
  const handleDeleteNote = (noteId) => {
    setDeleteModal({ open: true, id: noteId });
  };

  const confirmDeleteNote = async () => {
    try {
      await noteService.deleteNote(deleteModal.id);
      showSuccess('Note moved to trash');
      setDeleteModal({ open: false, id: null });
      fetchDashboardData();
    } catch (err) {
      showError('Failed to move note to trash');
    }
  };

  // Create Category from quick action
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setCatLoading(true);
      await categoryService.createCategory({
        name: newCatName.trim(),
        color: newCatColor,
        icon: 'Folder',
      });
      showSuccess('Category created successfully!');
      setCategoryModalOpen(false);
      setNewCatName('');
      fetchDashboardData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCatLoading(false);
    }
  };

  // Handle Quick Note / File import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const submitFileUpload = async () => {
    if (!uploadFile) return;
    try {
      const text = await uploadFile.text();
      const title = uploadFile.name.replace(/\.[^/.]+$/, '');
      await noteService.createNote({
        title,
        content: text,
        category: uploadCategory,
        tags: ['Imported', uploadCategory],
      });
      showSuccess(`File "${uploadFile.name}" imported as new note!`);
      setUploadModalOpen(false);
      setUploadFile(null);
      fetchDashboardData();
    } catch (err) {
      showError('Failed to import file contents.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organize your ideas. Learn smarter. Stay productive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/notes/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </Link>
        </div>
      </div>

      {/* Statistics Section (4 modern cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatCard
              title="Total Notes"
              value={stats?.totalNotes ?? 0}
              icon={FileText}
              accentColor="indigo"
              description="Active notes in vault"
              trend="+4"
              onClick={() => navigate('/notes')}
            />
            <StatCard
              title="Favorites"
              value={stats?.favoriteNotes ?? 0}
              icon={Heart}
              accentColor="rose"
              description="Pinned priority notes"
              trend="+2"
              onClick={() => navigate('/favorites')}
            />
            <StatCard
              title="Categories"
              value={stats?.totalCategories ?? 0}
              icon={Folder}
              accentColor="emerald"
              description="Subject modules"
              onClick={() => navigate('/categories')}
            />
            <StatCard
              title="Recent Activity"
              value={stats?.recentActivity ?? 0}
              icon={Activity}
              accentColor="purple"
              description="Updated in last 7 days"
              onClick={() => navigate('/recent')}
            />
          </>
        )}
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/notes/create"
            className="group p-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle hover:shadow-card-hover hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Create Note
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Blank markdown document</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="group p-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle hover:shadow-card-hover hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 flex items-center gap-3.5 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Upload Note
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Import .txt or .md file</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className="group p-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle hover:shadow-card-hover hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 flex items-center gap-3.5 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Create Category
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add custom subject folder</p>
            </div>
          </button>

          <Link
            to="/favorites"
            className="group p-4 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle hover:shadow-card-hover hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-200 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                View Favorites
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Directly jump to starred notes</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Horizontal Category Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Categories & Subjects
          </h2>
          <Link
            to="/categories"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Manage All Categories <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.name}
              to={`/notes?category=${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-[#263244] shadow-xs hover:shadow-card-hover hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shrink-0 group"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color || '#4F46E5' }}
              />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                {cat.noteCount ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notes Section (4-6 notes) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Recent Notes
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recently created or modified technical notes
            </p>
          </div>
          <Link
            to="/notes"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Notes →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : stats?.recentNotes && stats.recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.recentNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onFavorite={handleToggleFavorite}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="notes"
            title="No notes yet"
            description="Create your first technical note or explore pre-configured categories."
            actionText="Create Note"
            actionLink="/notes/create"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={confirmDeleteNote}
        title="Move to Trash"
        message="This note will be moved to the Trash. You can restore it anytime or delete it permanently."
        confirmText="Move to Trash"
      />

      {/* Quick Category Creation Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Create New Category"
        subtitle="Group your notes under a custom subject or topic."
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label
              htmlFor="dashboard-cat-name"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1"
            >
              Category Name
            </label>
            <input
              id="dashboard-cat-name"
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Distributed Systems"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                '#4F46E5',
                '#7C3AED',
                '#2563EB',
                '#10B981',
                '#F59E0B',
                '#EC4899',
                '#06B6D4',
                '#64748B',
              ].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setNewCatColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    newCatColor === c ? 'scale-110 border-white ring-2 ring-indigo-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={catLoading}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              {catLoading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Note Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Note File"
        subtitle="Import a markdown or text file directly into your knowledge vault."
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="upload-cat-select"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="upload-cat-select"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl"
            >
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {uploadFile ? uploadFile.name : 'Select a .md or .txt file to import'}
            </p>
            <label className="cursor-pointer inline-block mt-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
              Browse Files
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitFileUpload}
              disabled={!uploadFile}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl"
            >
              Import Note
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
