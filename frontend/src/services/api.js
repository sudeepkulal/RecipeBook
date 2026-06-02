const BASE_URL = 'http://localhost:5000/api';

/**
 * Standard fetch request helper, automatically setting CORS cookies and headers.
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Set credentials and default headers
  const defaultOptions = {
    credentials: 'include', // Send secure JWT session cookies
    ...options,
  };

  if (!defaultOptions.headers) {
    defaultOptions.headers = {};
  }

  // Set Content-Type only if it is NOT FormData (browser sets boundary automatically for FormData)
  if (!(defaultOptions.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, defaultOptions);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error in ${endpoint}:`, error);
    throw error;
  }
};

const api = {
  // Authentication services
  auth: {
    register: (username, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
    login: (username, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () =>
      request('/auth/logout', {
        method: 'GET',
      }),
    getMe: () =>
      request('/auth/me', {
        method: 'GET',
      }),
    getUserById: (id) =>
      request(`/auth/user/${id}`, {
        method: 'GET',
      }),
  },

  // Recipes services
  recipes: {
    getAll: (filters = {}) => {
      let queryParams = [];
      if (filters.title) queryParams.push(`title=${encodeURIComponent(filters.title)}`);
      if (filters.ingredients) queryParams.push(`ingredients=${encodeURIComponent(filters.ingredients)}`);
      if (filters.difficulty) queryParams.push(`difficulty=${encodeURIComponent(filters.difficulty)}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      return request(`/recipes${queryString}`, { method: 'GET' });
    },
    getById: (id) =>
      request(`/recipes/${id}`, { method: 'GET' }),
    getByUser: (userId) =>
      request(`/recipes/user/${userId}`, { method: 'GET' }),
    create: (recipeData) =>
      request('/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData),
      }),
    update: (id, recipeData) =>
      request(`/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(recipeData),
      }),
    delete: (id) =>
      request(`/recipes/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) =>
      request('/recipes/upload', {
        method: 'POST',
        body: formData,
      }),
  },

  // Comments services
  comments: {
    getByRecipe: (recipeId) =>
      request(`/comments/recipe/${recipeId}`, { method: 'GET' }),
    create: (recipeId, text, rating) =>
      request('/comments', {
        method: 'POST',
        body: JSON.stringify({ recipeId, text, rating }),
      }),
  },

  // Feedback services
  feedback: {
    send: (email, subject, message) =>
      request('/feedback', {
        method: 'POST',
        body: JSON.stringify({ email, subject, message }),
      }),
  },
};

export default api;
