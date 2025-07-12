import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardConfig, setDashboardConfig] = useState({});

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
          await loadDashboardConfig();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setUser(userData);
    await loadDashboardConfig();
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUser(null);
        setDashboardConfig({});
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadDashboardConfig = async () => {
    try {
      const response = await fetch('/api/auth/dashboard-config', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardConfig(data.config || {});
      }
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
    }
  };

  const saveDashboardConfig = async (config) => {
    try {
      const response = await fetch('/api/auth/dashboard-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ config }),
      });
      
      if (response.ok) {
        setDashboardConfig(config);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save dashboard config:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    dashboardConfig,
    login,
    logout,
    saveDashboardConfig,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 