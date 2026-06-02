const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a recipe title'],
    trim: true,
  },
  image: {
    type: String,
    default: '',
  },
  ingredients: {
    type: [String],
    required: [true, 'Please provide at least one ingredient'],
  },
  instructions: {
    type: [String],
    required: [true, 'Please provide instruction steps'],
  },
  time: {
    type: Number, // in minutes
    required: [true, 'Please specify the time required in minutes'],
  },
  dish: {
    type: String,
    required: [true, 'Please select the type of dish (e.g. Sweet, Spicy, Sour)'],
    enum: ['Sweet', 'Spicy', 'Sour'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
