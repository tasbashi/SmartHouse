import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useMqtt } from '../../contexts/MqttContext';
import Icon from '../ui/Icon';

const Navbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { connectionStatus, isConnected } = useMqtt();

  return (
    <nav className="navbar px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Icon name="menu" size={24} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Icon name="home" size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Smart Home Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                MQTT Control Panel
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* MQTT Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus.connected 
                ? 'bg-success-500 pulse-ring' 
                : 'bg-danger-500'
            }`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {connectionStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
            {connectionStatus.connected && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {connectionStatus.brokerAddress}:{connectionStatus.port}
              </span>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Icon 
              name={isDark ? 'sun' : 'moon'} 
              size={20} 
              className="text-gray-600 dark:text-gray-400" 
            />
          </button>

          {/* Connection Status Icon */}
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <Icon 
              name={isConnected ? 'wifi' : 'wifi-off'} 
              size={20} 
              className={isConnected ? 'text-success-600' : 'text-danger-600'} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 