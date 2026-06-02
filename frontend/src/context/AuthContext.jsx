import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to normalize user object with both id and _id properties
  const setNormalizedUser = (userData) => {
    if (userData) {
      setUser({
        ...userData,
        id: userData.id || userData._id,
        _id: userData._id || userData.id,
      });
    } else {
      setUser(null);
    }
  };

  // Check if user is already logged in on reload
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const data = await api.auth.getMe();
        if (data.success) {
          setNormalizedUser(data.user);
        } else {
          setNormalizedUser(null);
        }
      } catch (err) {
        // Suppress initial check errors to prevent visual alert noise
        setNormalizedUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const registerUser = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.auth.register(username, email, password);
      if (data.success) {
        setNormalizedUser(data.user);
        return { success: true };
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.auth.login(username, password);
      if (data.success) {
        setNormalizedUser(data.user);
        return { success: true };
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      const data = await api.auth.logout();
      if (data.success) {
        setNormalizedUser(null);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
