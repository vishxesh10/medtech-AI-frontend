import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch, authLogin, authRegister, clearAuth, getAccessToken, readErrorMessage } from '../api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) return null;

    try {
      const response = await apiFetch('/auth/me');
      if (response.ok) return await response.json();
      clearAuth();
      return null;
    } catch {
      clearAuth();
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    refreshUser()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const authenticate = useCallback(async (email, password) => {
    const response = await authLogin(email, password);
    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const currentUser = await refreshUser();
    if (!currentUser) {
      throw new Error('Could not load your account. Please sign in again.');
    }
    setUser(currentUser);
    return currentUser;
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    setAuthBusy(true);
    try {
      return await authenticate(email, password);
    } finally {
      setAuthBusy(false);
    }
  }, [authenticate]);

  const register = useCallback(async (email, password) => {
    setAuthBusy(true);
    try {
      const response = await authRegister(email, password);
      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }
      return await authenticate(email, password);
    } finally {
      setAuthBusy(false);
    }
  }, [authenticate]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ authBusy, authLoading, login, logout, register, user }),
    [authBusy, authLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
