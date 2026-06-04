import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

export const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const persist = useCallback((nextUser, token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { user: u, token } = await authService.login(credentials);
      persist(u, token);
      return u;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const { user: u, token } = await authService.register(payload);
      persist(u, token);
      return u;
    },
    [persist]
  );

  const updateUser = useCallback((nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  // On mount, if a token exists, refresh the user from the server.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then(({ user: u }) => updateUser(u))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout, updateUser]);

  // React to the api interceptor's unauthorized signal.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('spp:unauthorized', handler);
    return () => window.removeEventListener('spp:unauthorized', handler);
  }, [logout]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUser, isAuthenticated: Boolean(user) }),
    [user, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
