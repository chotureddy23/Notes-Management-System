const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// All note routes are protected by JWT authentication
router.use(protect);

router.route('/')
  .post(createNote)
  .get(getNotes);

router.get('/search', searchNotes);
router.get('/trash/all', getTrashNotes);
router.delete('/trash/empty', emptyTrash);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.put('/:id/restore', restoreNote);
router.delete('/:id/permanent', permanentDeleteNote);
router.put('/:id/favorite', toggleFavorite);

module.exports = router;
