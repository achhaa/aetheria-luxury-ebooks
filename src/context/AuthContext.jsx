import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aetheria_auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Synchronize and restore session on app load
  useEffect(() => {
    let isCancelled = false;

    async function checkAuthSession() {
      const savedToken = localStorage.getItem('aetheria_auth_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.user) {
            setUser(data.user);
            setToken(savedToken);
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem('aetheria_auth_token');
          if (!isCancelled) {
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        console.debug('[AuthContext] Session restore notice:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Handle Google Login submission to backend
  const handleGoogleCredential = useCallback(async ({ credential, profile }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, profile }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Google authentication failed.');
      }

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('aetheria_auth_token', data.token);
        localStorage.setItem('aetheria_customer_email', data.user.email);
        setToken(data.token);
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true, user: data.user };
      }
      throw new Error('Invalid authentication response from server.');
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Quick Instant Google Sign-In helper (ideal for testing, one-click demo, and local dev)
  const loginWithDemoAccount = useCallback(async (customEmail = null, customName = null) => {
    const demoProfiles = [
      {
        id: 'google_user_vance_01',
        email: customEmail || 'alexandra.vance@aetheria.luxury',
        name: customName || 'Alexandra Vance',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      {
        id: 'google_user_sterling_02',
        email: customEmail || 'marcus.sterling@aetheria.luxury',
        name: customName || 'Marcus Sterling',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    ];

    const selected = demoProfiles[0];
    return handleGoogleCredential({ profile: selected });
  }, [handleGoogleCredential]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('aetheria_auth_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(user && token),
        isAuthModalOpen,
        setIsAuthModalOpen,
        handleGoogleCredential,
        loginWithDemoAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
