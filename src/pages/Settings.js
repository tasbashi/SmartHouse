import React, { useState, useEffect } from 'react';
import { useMqtt } from '../contexts/MqttContext';
import { useTheme } from '../contexts/ThemeContext';
import Icon from '../components/ui/Icon';

const Settings = () => {
  const { connectToMqtt, disconnectFromMqtt, connectionStatus } = useMqtt();
  const { isDark, toggleTheme } = useTheme();
  
  const [connectionSettings, setConnectionSettings] = useState({
    brokerAddress: '',
    port: 8883,
    username: '',
    password: '',
    useTLS: true,
    cleanSession: true,
    useAwsCerts: false
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Load saved connection settings
    const saved = localStorage.getItem('mqtt-connection-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setConnectionSettings(prev => ({ ...prev, ...settings }));
      } catch (error) {
        console.error('Error loading connection settings:', error);
      }
    }
  }, []);

  const saveConnectionSettings = (settings) => {
    // Don't save password for security
    const toSave = { ...settings };
    delete toSave.password;
    localStorage.setItem('mqtt-connection-settings', JSON.stringify(toSave));
  };

  const handleConnect = async () => {
    if (!connectionSettings.brokerAddress || !connectionSettings.port) {
      setConnectionMessage('Please enter broker address and port');
      return;
    }

    setIsConnecting(true);
    setConnectionMessage('Connecting...');

    try {
      const result = await connectToMqtt(connectionSettings);
      
      if (result.success) {
        setConnectionMessage('Connected successfully!');
        saveConnectionSettings(connectionSettings);
      } else {
        setConnectionMessage(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionMessage(`Connection error: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(true);
    setConnectionMessage('Disconnecting...');

    try {
      const result = await disconnectFromMqtt();
      
      if (result.success) {
        setConnectionMessage('Disconnected successfully');
      } else {
        setConnectionMessage(`Disconnect failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionMessage(`Disconnect error: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const testConfigurations = [
    {
      name: 'EMQX Public (MQTT)',
      config: {
        brokerAddress: 'broker.emqx.io',
        port: 1883,
        useTLS: false,
        username: '',
        password: ''
      }
    },
    {
      name: 'EMQX Public (MQTTS)',
      config: {
        brokerAddress: 'broker.emqx.io',
        port: 8883,
        useTLS: true,
        username: '',
        password: ''
      }
    },
    {
      name: 'Eclipse IoT',
      config: {
        brokerAddress: 'iot.eclipse.org',
        port: 1883,
        useTLS: false,
        username: '',
        password: ''
      }
    },
    {
      name: 'Mosquitto Test',
      config: {
        brokerAddress: 'test.mosquitto.org',
        port: 1883,
        useTLS: false,
        username: '',
        password: ''
      }
    }
  ];

  const loadTestConfig = (config) => {
    setConnectionSettings(prev => ({
      ...prev,
      ...config,
      cleanSession: true,
      useAwsCerts: false
    }));
  };

  const clearData = () => {
    if (window.confirm('This will clear all saved devices and settings. Are you sure?')) {
      localStorage.removeItem('smart-home-devices');
      localStorage.removeItem('smart-home-layout');
      localStorage.removeItem('mqtt-connection-settings');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure MQTT connection and application preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* MQTT Connection */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                MQTT Connection
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure connection to your MQTT broker
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus.connected ? 'bg-success-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {connectionStatus.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Broker Address *
              </label>
              <input
                type="text"
                className="input"
                placeholder="broker.hivemq.com"
                value={connectionSettings.brokerAddress}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  brokerAddress: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Port *
              </label>
              <input
                type="number"
                className="input"
                placeholder="8883"
                value={connectionSettings.port}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  port: parseInt(e.target.value) || 8883
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username (Optional)
              </label>
              <input
                type="text"
                className="input"
                placeholder="username"
                value={connectionSettings.username}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  username: e.target.value
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password (Optional)
              </label>
              <input
                type="password"
                className="input"
                placeholder="password"
                value={connectionSettings.password}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  password: e.target.value
                })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={connectionSettings.useTLS}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  useTLS: e.target.checked
                })}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Use TLS/SSL
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={connectionSettings.cleanSession}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  cleanSession: e.target.checked
                })}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Clean Session
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={connectionSettings.useAwsCerts}
                onChange={(e) => setConnectionSettings({
                  ...connectionSettings,
                  useAwsCerts: e.target.checked
                })}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Use AWS IoT Certificates
              </span>
            </label>
          </div>

          <div className="flex space-x-3 mb-4">
            {!connectionStatus.connected ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="btn btn-primary"
              >
                {isConnecting ? (
                  <>
                    <Icon name="refresh" size={16} className="mr-2 spinner" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Icon name="wifi" size={16} className="mr-2" />
                    Connect
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                disabled={isConnecting}
                className="btn btn-danger"
              >
                <Icon name="wifi-off" size={16} className="mr-2" />
                Disconnect
              </button>
            )}

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn btn-secondary"
            >
              <Icon name="settings" size={16} className="mr-2" />
              Advanced
            </button>
          </div>

          {connectionMessage && (
            <div className={`p-3 rounded-lg ${
              connectionMessage.includes('success') || connectionMessage.includes('Connected')
                ? 'bg-success-50 text-success-800 dark:bg-success-900/20 dark:text-success-200'
                : 'bg-danger-50 text-danger-800 dark:bg-danger-900/20 dark:text-danger-200'
            }`}>
              {connectionMessage}
            </div>
          )}

          {/* Test Configurations */}
          {showAdvanced && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Test Configurations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testConfigurations.map((test, index) => (
                  <button
                    key={index}
                    onClick={() => loadTestConfig(test.config)}
                    className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {test.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {test.config.brokerAddress}:{test.config.port}
                      {test.config.useTLS ? ' (TLS)' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle between light and dark themes
                </p>
              </div>
              
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Data Management
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remove all saved devices, layouts, and settings
                </p>
              </div>
              
              <button
                onClick={clearData}
                className="btn btn-danger"
              >
                <Icon name="trash" size={16} className="mr-2" />
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            System Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Version:</span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Build:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Theme:</span>
              <span className="text-gray-900 dark:text-white">
                {isDark ? 'Dark' : 'Light'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Connection:</span>
              <span className={`${
                connectionStatus.connected 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {connectionStatus.connected ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 