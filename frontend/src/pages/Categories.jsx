import React, { useState, useEffect } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { categoryService } from '../services/api';
import { useToast } from '../context/ToastContext';
import CategoryCard from '../components/CategoryCard';
import { Modal, ConfirmModal } from '../components/Modal';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const COLOR_OPTIONS = [
  '#4F46E5', // Indigo
  '#7C3AED', // Purple
  '#2563EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
];

const ICON_OPTIONS = [
  'Folder',
  'Code',
  'Database',
  'Globe',
  'Cpu',
  'Calculator',
  'Atom',
  'Terminal',
  'User',
  'FileText',
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Create/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [icon, setIcon] = useState('Folder');
  const [description, setDescription] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setColor('#4F46E5');
    setIcon('Folder');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setColor(cat.color || '#4F46E5');
    setIcon(cat.icon || 'Folder');
    setDescription(cat.description || '');
    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setFormLoading(true);
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, {
          name: name.trim(),
          color,
          icon,
          description: description.trim(),
        });
        showSuccess('Category updated successfully.');
      } else {
        await categoryService.createCategory({
          name: name.trim(),
          color,
          icon,
          description: description.trim(),
        });
        showSuccess('Category created successfully.');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = (cat) => {
    setDeleteModal({ open: true, category: cat });
  };

  const confirmDeleteCategory = async () => {
    try {
      await categoryService.deleteCategory(deleteModal.category._id);
      showSuccess(`Category deleted. Associated notes moved to Other.`);
      setDeleteModal({ open: false, category: null });
      fetchCategories();
    } catch (err) {
      showError('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Categories
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {categories.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Group and structure your notes by subject, language, or custom project.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id || cat.name}
              category={cat}
              onEdit={openEditModal}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="categories"
          actionText="Create Category"
          onAction={openCreateModal}
        />
      )}

      {/* Create / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        subtitle="Organize notes by subject or theme."
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label
              htmlFor="category-name-input"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1"
            >
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="category-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cloud Architecture"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category-desc-input"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1"
            >
              Short Description
            </label>
            <input
              id="category-desc-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of this subject"
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-white ring-2 ring-indigo-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="category-icon-select"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5"
            >
              Icon Theme
            </label>
            <select
              id="category-icon-select"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-[#172033] border border-gray-200 dark:border-[#263244] rounded-xl"
            >
              {ICON_OPTIONS.map((ico) => (
                <option key={ico} value={ico}>
                  {ico}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              {formLoading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Delete "${deleteModal.category?.name}"? Any notes under this category will automatically be moved to "Other".`}
        confirmText="Delete Category"
      />
    </div>
  );
};

export default Categories;
