/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../services/api';

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

const STORAGE_KEY = 'caresmart_user';

// ── Helper: load persisted user from localStorage ────────────────────────────
const loadStoredUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);

  /**
   * Persist user data (includes token) to state + localStorage.
   */
  const persistUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, []);

  /**
   * login — calls POST /api/auth/login, persists result.
   * Returns the user object on success.
   * Throws the Axios error so callers can display messages.
   */
  const login = useCallback(
    async (email, password) => {
      const { data } = await loginUser(email, password);
      const userData = { ...data.user, token: data.token };
      persistUser(userData);
      return userData;
    },
    [persistUser]
  );

  /**
   * register — calls POST /api/auth/register, persists result.
   * Returns the user object on success.
   * Throws the Axios error so callers can display messages.
   */
  const register = useCallback(
    async (name, email, password) => {
      const { data } = await registerUser(name, email, password);
      const userData = { ...data.user, token: data.token };
      persistUser(userData);
      return userData;
    },
    [persistUser]
  );

  /**
   * logout — clears state and localStorage.
   */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    user, // full user object (includes role, token, deviceProfile…)
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
