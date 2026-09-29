const Category = require('../models/Category');
const Note = require('../models/Note');

// @desc    Get all categories for authenticated user with note counts
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });

    // Aggregate note counts per category
    const noteCounts = await Note.aggregate([
      {
        $match: {
          user: req.user._id,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    noteCounts.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      description: cat.description,
      createdAt: cat.createdAt,
      noteCount: countMap[cat.name] || 0,
    }));

    res.json(categoriesWithCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({
      name: trimmedName,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name: trimmedName,
      color: color || '#4F46E5',
      icon: icon || 'Folder',
      description: description ? description.trim() : '',
      user: req.user._id,
    });

    res.status(201).json({
      ...category.toObject(),
      noteCount: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, color, icon, description } = req.body;
    const oldName = category.name;

    if (name && name.trim()) {
      const trimmedName = name.trim();
      // If name changed, check uniqueness
      if (trimmedName !== oldName) {
        const existing = await Category.findOne({
          name: trimmedName,
          user: req.user._id,
        });
        if (existing) {
          return res.status(400).json({ message: 'A category with this name already exists' });
        }

        // Also update all notes referencing the old category name!
        await Note.updateMany(
          { user: req.user._id, category: oldName },
          { category: trimmedName }
        );
        category.name = trimmedName;
      }
    }

    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description.trim();

    const updatedCategory = await category.save();

    // Get updated note count
    const noteCount = await Note.countDocuments({
      user: req.user._id,
      category: updatedCategory.name,
      isDeleted: false,
    });

    res.json({
      ...updatedCategory.toObject(),
      noteCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Reassign notes with this category to 'Other'
    await Note.updateMany(
      { user: req.user._id, category: category.name },
      { category: 'Other' }
    );

    await Category.deleteOne({ _id: category._id });

    res.json({ message: 'Category deleted and associated notes reassigned to Other' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
