const Note = require('../models/Note');

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, category, tags, favorite } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Note title is required' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    // Process tags array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }

    const note = await Note.create({
      title: title.trim(),
      content,
      category: category && category.trim() ? category.trim() : 'General',
      tags: processedTags,
      favorite: Boolean(favorite),
      user: req.user._id,
      isDeleted: false,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all notes for authenticated user (with filtering, search, sorting, pagination)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const {
      category,
      favorite,
      search,
      q,
      sort,
      trash,
      page = 1,
      limit = 50,
    } = req.query;

    const queryFilter = {
      user: req.user._id,
      isDeleted: trash === 'true',
    };

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      queryFilter.category = category;
    }

    // Favorite filter
    if (favorite === 'true' || favorite === true) {
      queryFilter.favorite = true;
    }

    // Search query (title, content, category, tags)
    const searchTerm = q || search;
    if (searchTerm && searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), 'i');
      queryFilter.$or = [
        { title: regex },
        { content: regex },
        { category: regex },
        { tags: { $in: [regex] } },
      ];
    }

    // Sorting logic
    let sortOption = { updatedAt: -1 }; // Default: Recently Updated
    if (sort === 'created' || sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'title-asc' || sort === 'az') {
      sortOption = { title: 1 };
    } else if (sort === 'title-desc' || sort === 'za') {
      sortOption = { title: -1 };
    } else if (sort === 'recent') {
      sortOption = { updatedAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const totalNotes = await Note.countDocuments(queryFilter);
    const notes = await Note.find(queryFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      notes,
      page: pageNum,
      pages: Math.ceil(totalNotes / limitNum) || 1,
      totalNotes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search notes
// @route   GET /api/notes/search
// @access  Private
const searchNotes = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ notes: [], total: 0 });
    }

    const regex = new RegExp(q.trim(), 'i');
    const notes = await Note.find({
      user: req.user._id,
      isDeleted: false,
      $or: [
        { title: regex },
        { content: regex },
        { category: regex },
        { tags: { $in: [regex] } },
      ],
    }).sort({ updatedAt: -1 });

    res.json({ notes, total: notes.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    const { title, content, category, tags, favorite } = req.body;

    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category.trim();
    if (favorite !== undefined) note.favorite = Boolean(favorite);

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        note.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        note.tags = tags
          .split(',')
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean);
      }
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete note (move to trash)
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    note.isDeleted = true;
    note.deletedAt = new Date();
    await note.save();

    res.json({ message: 'Note moved to trash', noteId: note._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore note from trash
// @route   PUT /api/notes/:id/restore
// @access  Private
const restoreNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    note.isDeleted = false;
    note.deletedAt = null;
    await note.save();

    res.json({ message: 'Note restored successfully', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete note
// @route   DELETE /api/notes/:id/permanent
// @access  Private
const permanentDeleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.json({ message: 'Note permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite status of note
// @route   PUT /api/notes/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    note.favorite = !note.favorite;
    await note.save();

    res.json({
      message: note.favorite ? 'Added to favorites' : 'Removed from favorites',
      favorite: note.favorite,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all trash notes
// @route   GET /api/notes/trash/all
// @access  Private
const getTrashNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.json({ notes, total: notes.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Empty entire trash for user
// @route   DELETE /api/notes/trash/empty
// @access  Private
const emptyTrash = async (req, res, next) => {
  try {
    const result = await Note.deleteMany({
      user: req.user._id,
      isDeleted: true,
    });

    res.json({
      message: 'Trash emptied successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  searchNotes,
  getNoteById,
  updateNote,
  deleteNote,
  restoreNote,
  permanentDeleteNote,
  toggleFavorite,
  getTrashNotes,
  emptyTrash,
};
