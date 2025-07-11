import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { MqttProvider } from './contexts/MqttContext';
import { DeviceProvider } from './contexts/DeviceContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DebugPanel from './components/ui/DebugPanel';
import DevicesDebug from './components/ui/DevicesDebug';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ThemeProvider>
      <MqttProvider>
        <DeviceProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              
              <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                
                <main className="flex-1 overflow-hidden lg:ml-0">
                  <div className="h-full overflow-y-auto">
                    <div className="p-4 sm:p-6 max-w-full">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/devices" element={<Devices />} />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </div>
                  </div>
                </main>
              </div>
              
              <DebugPanel />
              <DevicesDebug />
            </div>
          </Router>
        </DeviceProvider>
      </MqttProvider>
    </ThemeProvider>
  );
}

export default App; 