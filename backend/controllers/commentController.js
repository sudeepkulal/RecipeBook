const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all comments for a recipe
// @route   GET /api/comments/recipe/:recipeId
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ recipe: req.params.recipeId })
    .populate('user', 'username')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: comments.length, data: comments });
});

// @desc    Create a new comment/rating
// @route   POST /api/comments
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const { recipeId, text, rating } = req.body;

  if (!recipeId || !text || !rating) {
    return next(new ErrorResponse('Please provide recipeId, comment text, and rating', 400));
  }

  // Check if recipe exists
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return next(new ErrorResponse(`Recipe not found with id of ${recipeId}`, 404));
  }

  // Create the comment
  const comment = await Comment.create({
    recipe: recipeId,
    user: req.user.id,
    text,
    rating: Number(rating),
  });

  // Populate user username to return directly to frontend
  const populatedComment = await comment.populate('user', 'username');

  res.status(201).json({ success: true, data: populatedComment });
});
