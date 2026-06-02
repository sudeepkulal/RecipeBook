const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getUserRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  uploadImage,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/user/:userId', getUserRecipes);

router.route('/')
  .get(getRecipes)
  .post(protect, createRecipe);

router.route('/:id')
  .get(getRecipe)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

module.exports = router;
