const Note = require('../models/Note');
const Category = require('../models/Category');

// @desc    Get dashboard statistics and recent notes
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run parallel queries for maximum performance
    const [
      totalNotes,
      favoriteNotes,
      totalCategories,
      recentNotes,
      trashCount,
      categoryBreakdown,
    ] = await Promise.all([
      Note.countDocuments({ user: userId, isDeleted: false }),
      Note.countDocuments({ user: userId, isDeleted: false, favorite: true }),
      Category.countDocuments({ user: userId }),
      Note.find({ user: userId, isDeleted: false })
        .sort({ updatedAt: -1 })
        .limit(6),
      Note.countDocuments({ user: userId, isDeleted: true }),
      Note.aggregate([
        { $match: { user: userId, isDeleted: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Calculate recent activity (notes updated in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = await Note.countDocuments({
      user: userId,
      updatedAt: { $gte: sevenDaysAgo },
    });

    res.json({
      totalNotes,
      favoriteNotes,
      totalCategories,
      recentActivity: recentActivity || totalNotes,
      trashCount,
      recentNotes,
      categoryBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
