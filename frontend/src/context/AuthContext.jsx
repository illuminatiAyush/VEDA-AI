/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AuthContext — Singleton JWT Auth Provider                      ║
 * ║  Pattern: Production-Grade REST Token Lifecycle Guard            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const AuthContext = createContext({});
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // STRICT MODE GUARD: Prevents double-mount firing bootstrap concurrently
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const bootstrap = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('[Auth] /me response:', response.status, data);
        
        if (response.ok && data.success && data.user) {
          const fetchedUser = data.user;
          setUser(fetchedUser);
          console.log('[Auth] Session restored for:', fetchedUser.email);
        } else {
          console.warn('[Auth] Token invalid or expired:', data.error || data);
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] Session hydration FAILED:', err.message, err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('[Auth] Login attempt:', email);
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      console.log('[Auth] Login response:', response.status, data);

      if (!response.ok || !data.success) {
        const errMsg = data.error || data.details?.map(d => d.message).join(', ') || 'Login failed';
        console.error('[Auth] Login FAILED:', response.status, errMsg, data);
        return { success: false, error: errMsg };
      }

      const { token, user: loggedUser } = data;
      localStorage.setItem('token', token);
      setUser(loggedUser);
      console.log('[Auth] Login SUCCESS:', loggedUser.email);

      return { success: true, user: loggedUser };
    } catch (err) {
      console.error('[Auth] Login NETWORK ERROR:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (email, password) => {
    try {
      console.log('[Auth] Register attempt:', email);
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: email.split('@')[0],
        })
      });
      const data = await response.json();
      console.log('[Auth] Register response:', response.status, data);

      if (!response.ok || !data.success) {
        const errMsg = data.error || data.details?.map(d => `${d.field}: ${d.message}`).join(', ') || 'Registration failed';
        console.error('[Auth] Register FAILED:', response.status, errMsg, data);
        return { success: false, error: errMsg };
      }

      const { token, user: newUser } = data;
      localStorage.setItem('token', token);
      setUser(newUser);
      console.log('[Auth] Register SUCCESS:', newUser.email);

      return { success: true, user: newUser };
    } catch (err) {
      console.error('[Auth] Register NETWORK ERROR:', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Nuke all session values and redirect cleanly to home page
    try {
      sessionStorage.clear();
    } catch (_) {}
    
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
