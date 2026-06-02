const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all recipes (with search & filtering)
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = asyncHandler(async (req, res, next) => {
  const { title, ingredients, difficulty } = req.query;
  let query = {};

  // 1. Filter by Title (case-insensitive partial match)
  if (title) {
    query.title = { $regex: title, $options: 'i' };
  }

  // 2. Filter by Ingredients (matches any of the searched ingredients)
  if (ingredients) {
    const ingredientsList = ingredients.split(',').map((ing) => ing.trim());
    const ingredientRegexes = ingredientsList.map((ing) => new RegExp(ing, 'i'));
    query.ingredients = { $in: ingredientRegexes };
  }

  // 3. Filter by Cooking Time / Difficulty
  if (difficulty) {
    if (difficulty === 'Easy') {
      query.time = { $lte: 20 };
    } else if (difficulty === 'Medium') {
      query.time = { $gt: 20, $lte: 40 };
    } else if (difficulty === 'Hard') {
      query.time = { $gt: 40 };
    }
  }

  const recipes = await Recipe.find(query).populate('createdBy', 'username');
  res.status(200).json({ success: true, count: recipes.length, data: recipes });
});

// @desc    Get all recipes of a specific user
// @route   GET /api/recipes/user/:userId
// @access  Public
exports.getUserRecipes = asyncHandler(async (req, res, next) => {
  const recipes = await Recipe.find({ createdBy: req.params.userId }).populate('createdBy', 'username');
  res.status(200).json({ success: true, count: recipes.length, data: recipes });
});

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
  
  if (!recipe) {
    return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: recipe });
});

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
  const { title, image, ingredients, instructions, time, dish } = req.body;

  const recipe = await Recipe.create({
    title,
    image,
    ingredients,
    instructions,
    time: Number(time),
    dish,
    createdBy: req.user.id,
  });

  res.status(201).json({ success: true, data: recipe });
});

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  let recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
  }

  // Ensure user is recipe creator
  if (recipe.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipe`, 401));
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: recipe });
});

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new ErrorResponse(`Recipe not found with id of ${req.params.id}`, 404));
  }

  // Ensure user is recipe creator
  if (recipe.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this recipe`, 401));
  }

  await recipe.deleteOne();
  // Also delete associated comments
  await Comment.deleteMany({ recipe: req.params.id });

  res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
});

// @desc    Upload cover image for recipe
// @route   POST /api/recipes/upload
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please select an image file to upload', 400));
  }
  const filePath = `/media/image/${req.file.filename}`;
  res.status(200).json({ success: true, filePath });
});
