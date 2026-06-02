import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, ArrowLeft, Save, Sparkles, PlusCircle } from 'lucide-react';

const RecipeForm = () => {
  const { id } = useParams(); // exists if in edit mode
  const { user } = useAuth();
  const navigate = useNavigate();

  const isEditMode = !!id;

  // Form Fields State
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [time, setTime] = useState('');
  const [dish, setDish] = useState('');
  
  // Dynamic lists states
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  const [instructions, setInstructions] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');

  // Submit states
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  // Redirect if guest
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  // Load existing recipe details if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchRecipeDetails = async () => {
        try {
          const res = await api.recipes.getById(id);
          
          if (res.success) {
            const r = res.data;
            // Verify if user is owner of recipe
            if (r.createdBy._id !== user.id) {
              navigate('/');
              return;
            }
            setTitle(r.title);
            setImage(r.image);
            setTime(r.time);
            setDish(r.dish);
            setIngredients(r.ingredients);
            setInstructions(r.instructions);
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error(err);
          navigate('/');
        }
      };

      fetchRecipeDetails();
    }
  }, [id, isEditMode]);

  // Add ingredient tag
  const handleAddIngredient = (e) => {
    e.preventDefault();
    const val = newIngredient.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients((prev) => [...prev, val]);
      setNewIngredient('');
    }
  };

  // Remove ingredient tag
  const handleRemoveIngredient = (val) => {
    setIngredients((prev) => prev.filter((item) => item !== val));
  };

  // Add instruction step
  const handleAddInstruction = (e) => {
    e.preventDefault();
    const val = newInstruction.trim();
    if (val) {
      setInstructions((prev) => [...prev, val]);
      setNewInstruction('');
    }
  };

  // Remove instruction step
  const handleRemoveInstruction = (index) => {
    setInstructions((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handle image file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const data = await api.recipes.uploadImage(formData);

      if (data.success) {
        setImage(data.filePath);
      } else {
        setError(data.message || 'Image upload failed.');
      }
    } catch (err) {
      setError(err.message || 'Connection failed during image upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submit (POST or PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!title.trim() || !time || !dish || ingredients.length === 0 || instructions.length === 0) {
      setError('Please fill out all fields. Make sure to add at least one ingredient and direction step.');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      image,
      ingredients,
      instructions,
      time: Number(time),
      dish,
    };

    try {
      const data = isEditMode
        ? await api.recipes.update(id, payload)
        : await api.recipes.create(payload);

      if (data.success) {
        navigate(`/recipes/${data.data._id}`);
      } else {
        setError(data.message || 'Error occurred while saving recipe.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-6 md:px-12 max-w-4xl mx-auto w-full">
      {/* Return to Dashboard */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-accent mb-8 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Form Card Layout */}
      <div className="glass rounded-3xl p-6 md:p-10 border border-white/5 relative">
        <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-accent animate-pulse" />
          {isEditMode ? 'Edit Recipe' : 'Upload Recipe'}
        </h1>
        <p className="text-gray-400 text-sm mb-8 border-b border-white/5 pb-4">
          Fill in the details below to publish your recipe card.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Title input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-white">Recipe Title</label>
            <input
              type="text"
              placeholder="e.g. Grandma's Apple Pie"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Time Required */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Time Required (in minutes)</label>
              <input
                type="number"
                placeholder="e.g. 45"
                min="1"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
              />
            </div>

            {/* Dish Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Dish Flavor Category</label>
              <select
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150 cursor-pointer"
              >
                <option value="" disabled>Select category</option>
                <option value="Sweet">Sweet</option>
                <option value="Spicy">Spicy</option>
                <option value="Sour">Sour</option>
              </select>
            </div>
          </div>

          {/* Dynamic Cover Image Selector */}
          <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
            <label className="text-sm font-bold text-white border-b border-white/5 pb-2">Recipe Cover Image</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Local File Uploader */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-400">Upload Image File</span>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-brand-accent/20 file:text-brand-accent
                      hover:file:bg-brand-accent/30 file:cursor-pointer"
                  />
                  {uploadingImage && (
                    <span className="text-xs text-brand-accent block mt-1.5 animate-pulse">Uploading file...</span>
                  )}
                </div>
              </div>

              {/* URL fallback */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-400">Or Paste Image URL</span>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image.startsWith('/media') ? '' : image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            {/* Thumbnail Preview */}
            {image && (
              <div className="mt-2 border-t border-white/5 pt-4 flex items-center gap-4">
                <div className="h-16 w-24 rounded-lg overflow-hidden border border-white/10 bg-brand-dark">
                  <img
                    src={image.startsWith('/media') ? `http://localhost:5000${image}` : image}
                    alt="Recipe preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Cover Image Preview</span>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold mt-1 block cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Ingredients builder */}
          <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
            <label className="text-sm font-bold text-white border-b border-white/5 pb-2">Ingredients List</label>
            
            {/* Render added tags */}
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="flex items-center gap-1 bg-white/10 text-brand-accent border border-white/5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                  >
                    {ing}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ing)}
                      className="text-gray-400 hover:text-red-400 cursor-pointer text-sm font-bold pl-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No ingredients added yet. Add items using the box below.</p>
            )}

            {/* Tag add input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 2 cups Refined Flour"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient(e)}
                className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2.5 bg-white/5 hover:bg-brand-accent hover:text-brand-dark rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-1 border border-white/10 hover:border-brand-accent"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>

          {/* Dynamic Instructions builder */}
          <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
            <label className="text-sm font-bold text-white border-b border-white/5 pb-2">Directions Steps</label>

            {/* Render steps */}
            {instructions.length > 0 ? (
              <ol className="flex flex-col gap-3 mb-2">
                {instructions.map((step, index) => (
                  <li key={index} className="flex items-center justify-between bg-brand-dark/50 border border-white/5 rounded-xl p-3 text-sm gap-4 transition-all duration-200 hover:border-white/10">
                    <div className="flex gap-2 items-start">
                      <span className="font-bold text-brand-accent">{index + 1}.</span>
                      <span className="text-gray-300 leading-relaxed">{step}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      className="p-1 text-gray-500 hover:text-red-400 cursor-pointer rounded transition-all duration-150"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-gray-500">No steps added yet. Add ordered steps using the box below.</p>
            )}

            {/* Step add input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Sift refined flour and mix with baking powder."
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddInstruction(e)}
                className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-4 py-2.5 bg-white/5 hover:bg-brand-accent hover:text-brand-dark rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-1 border border-white/10 hover:border-brand-accent"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 border-t border-white/5 pt-6 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : isEditMode ? 'Save Recipe' : 'Publish Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
