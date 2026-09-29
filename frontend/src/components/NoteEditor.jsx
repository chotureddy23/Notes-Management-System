import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Quote,
  Eye,
  Edit3,
  Heart,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoteEditor = ({
  initialData = {},
  categories = [],
  onSave,
  loading = false,
  isEdit = false,
}) => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category || 'Programming');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(initialData.tags || []);
  const [favorite, setFavorite] = useState(initialData.favorite || false);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData.title) setTitle(initialData.title);
    if (initialData.content) setContent(initialData.content);
    if (initialData.category) setCategory(initialData.category);
    if (initialData.tags) setTags(initialData.tags);
    if (initialData.favorite !== undefined) setFavorite(initialData.favorite);
  }, [initialData]);

  // Handle Tag Addition
  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '').replace(/,/g, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Helper to insert markdown text around selection
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  // Word count & reading time
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a note title');
      return;
    }
    if (!content.trim()) {
      setError('Note content cannot be empty');
      return;
    }
    setError('');

    onSave({
      title: title.trim(),
      content,
      category,
      tags,
      favorite,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Section (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle space-y-4">
            {/* Title Input */}
            <div>
              <label
                htmlFor="note-title"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5"
              >
                Note Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Python Data Structures & Algorithmic Complexity"
                className="w-full text-xl font-bold px-4 py-3 bg-gray-50 dark:bg-[#172033] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder-gray-400"
                required
              />
            </div>

            {/* Markdown Toolbar & Mode Switcher */}
            <div className="flex items-center justify-between border-y border-gray-100 dark:border-gray-800 py-2 flex-wrap gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('# ')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('1. ')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('- [ ] ')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Checklist"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdown('> ')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('```\n', '\n```')}
                  className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-[#172033] p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    !previewMode
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    previewMode
                      ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              </div>
            </div>

            {/* Editor Area / Preview */}
            {!previewMode ? (
              <div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note in markdown or plain text...&#10;&#10;Use ## for headings, **bold** for emphasis, and ``` for code blocks."
                  rows={15}
                  className="w-full p-4 bg-gray-50 dark:bg-[#172033] text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y placeholder-gray-400"
                  required
                />
              </div>
            ) : (
              <div className="p-6 bg-gray-50/50 dark:bg-[#172033]/50 border border-gray-200 dark:border-[#263244] rounded-xl min-h-[350px] note-markdown">
                {content ? (
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {content}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Note Information Panel (Right sidebar) */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-[#263244] shadow-subtle space-y-5">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Note Attributes
            </h4>

            {/* Category */}
            <div>
              <label
                htmlFor="note-category"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5"
              >
                Category
              </label>
              <select
                id="note-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#172033] text-gray-900 dark:text-gray-100 text-sm border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Programming">Programming</option>
                    <option value="Database">Database</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label
                htmlFor="note-tags"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5"
              >
                Tags (press Enter or comma)
              </label>
              <input
                id="note-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter..."
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#172033] text-gray-900 dark:text-gray-100 text-sm border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder-gray-400"
              />

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 rounded-lg"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-500 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart
                  className={`w-4 h-4 ${favorite ? 'text-rose-500 fill-current' : 'text-gray-400'}`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as Favorite
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFavorite(!favorite)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  favorite ? 'bg-rose-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    favorite ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <span>Words:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{words}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reading Time:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~{readingTime} min
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-98 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Note' : 'Save Note'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-150 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NoteEditor;
