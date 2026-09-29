const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
noteSchema.index({ user: 1, isDeleted: 1, updatedAt: -1 });
noteSchema.index({ user: 1, favorite: 1 });
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({
  title: 'text',
  content: 'text',
  category: 'text',
  tags: 'text',
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
