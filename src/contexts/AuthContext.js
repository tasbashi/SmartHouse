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
      // Removed console.error for production
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
      // Removed console.error for production
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
      // Removed console.error for production
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
        const data = await response.json();
        setDashboardConfig(config);
        return true;
      } else {
        // Removed console.error for production
        return false;
      }
    } catch (error) {
      // Removed console.error for production
      return false;
    }
  };

  const refreshDashboardConfig = async () => {
    await loadDashboardConfig();
  };

  const value = {
    user,
    loading,
    dashboardConfig,
    login,
    logout,
    saveDashboardConfig,
    refreshDashboardConfig,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 