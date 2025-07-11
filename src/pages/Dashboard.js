import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDevices } from '../contexts/DeviceContext';
import { useMqtt } from '../contexts/MqttContext';
import DeviceWidget from '../components/devices/DeviceWidget';
import Icon from '../components/ui/Icon';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const { devices, deviceLayouts, updateLayout, clearAllDevices, cleanupInvalidDevices } = useDevices();
  const { connectionStatus } = useMqtt();
  const [isEditing, setIsEditing] = useState(false);

  const deviceList = Object.values(devices).filter(device => device.enabled !== false); // Only show enabled devices
  const onlineDevices = deviceList.filter(device => device.isOnline);
  const offlineDevices = deviceList.filter(device => !device.isOnline);

  // Default layouts for different breakpoints
  const layouts = {
    lg: deviceLayouts,
    md: deviceLayouts,
    sm: deviceLayouts.map(item => ({ ...item, w: Math.min(item.w, 2), x: item.x % 2 })),
    xs: deviceLayouts.map(item => ({ ...item, w: 1, x: 0 })),
    xxs: deviceLayouts.map(item => ({ ...item, w: 1, x: 0 }))
  };

  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLayoutChange = useCallback((layout, layouts) => {
    if (isEditing && layout) {
      // Debounce layout updates to prevent excessive re-renders
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
      updateLayout(layout);
      }, 100);
    }
  }, [isEditing, updateLayout]);

  const getQuickStats = () => {
    const stats = {
      totalDevices: deviceList.length,
      onlineDevices: onlineDevices.length,
      offlineDevices: offlineDevices.length,
      temperature: 0,
      humidity: 0,
      alerts: 0
    };

    // Calculate average temperature and humidity
    const tempDevices = deviceList.filter(device => device.data?.Temp);
    const humidityDevices = deviceList.filter(device => device.data?.Humidity);
    
    if (tempDevices.length > 0) {
      stats.temperature = (tempDevices.reduce((sum, device) => sum + device.data.Temp, 0) / tempDevices.length).toFixed(1);
    }
    
    if (humidityDevices.length > 0) {
      stats.humidity = (humidityDevices.reduce((sum, device) => sum + device.data.Humidity, 0) / humidityDevices.length).toFixed(1);
    }

    // Count alerts (doors open, motion detected, etc.)
    stats.alerts = deviceList.filter(device => 
      device.data?.Door === 'Open' || 
      device.data?.Motion === 'Detected' ||
      device.data?.Status === 'Wet'
    ).length;

    return stats;
  };

  const stats = getQuickStats();

  if (deviceList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Icon name="home" size={40} className="sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Welcome to Your Smart Home Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4 text-sm sm:text-base">
            Get started by adding your first device. You can manually add devices or use auto-detection to discover MQTT devices.
          </p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center px-4">
            <button 
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => window.location.href = '/devices'}
            >
              <Icon name="plus" size={20} className="mr-2" />
              Add Device
            </button>
            <button 
              className="btn btn-secondary w-full sm:w-auto"
              onClick={() => window.location.href = '/devices'}
            >
              <Icon name="search" size={20} className="mr-2" />
              Auto-Detect Devices
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Monitor and control your smart home devices
          </p>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn w-full sm:w-auto ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Icon name={isEditing ? 'check' : 'edit'} size={20} className="mr-2" />
            {isEditing ? 'Done' : 'Edit Layout'}
          </button>
          
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus.connected ? 'bg-success-500' : 'bg-danger-500'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {connectionStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid mobile-grid-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="card p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Icon name="home" size={16} className="sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Total</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stats.totalDevices}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <Icon name="check-circle" size={16} className="sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Online</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stats.onlineDevices}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-danger-100 dark:bg-danger-900 rounded-lg">
              <Icon name="alert-circle" size={16} className="sm:w-5 sm:h-5 text-danger-600 dark:text-danger-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Offline</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stats.offlineDevices}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon name="thermometer" size={16} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Temp</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stats.temperature}°C
              </p>
            </div>
          </div>
        </div>

        <div className="card p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
              <Icon name="droplets" size={16} className="sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Humidity</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stats.humidity}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Icon name="alert-triangle" size={16} className="sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Alerts</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {stats.alerts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Device Overview
        </h2>
        
        {isEditing && (
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <Icon name="grid-3x3" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                <strong>Layout Edit Mode:</strong>
                <div className="mt-1 space-y-1">
                  <div className="hidden sm:block">Drag widgets to move them • Hover over edges/corners to resize • Changes auto-save</div>
                  <div className="sm:hidden">Drag widgets to move them • Changes auto-save</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ResponsiveGridLayout
          className={`layout ${isEditing ? 'editing-mode' : ''}`}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 8, sm: 4, xs: 2, xxs: 1 }}
          rowHeight={60}
          margin={[6, 6]}
          containerPadding={[0, 0]}
          isDraggable={isEditing}
          isResizable={isEditing && window.innerWidth >= 768}
          onLayoutChange={handleLayoutChange}
          compactType="vertical"
          preventCollision={false}
          useCSSTransforms={true}
          autoSize={true}
          resizeHandles={window.innerWidth >= 768 ? ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'] : []}
          allowOverlap={false}
          isBounded={true}
          transformScale={1}
          draggableHandle=".drag-handle"
        >
          {deviceList.map((device) => {
            const layout = deviceLayouts.find(l => l.i === device.id);
            return (
              <div 
                key={device.id} 
                data-grid={{
                  i: device.id,
                  x: layout?.x || 0,
                  y: layout?.y || Infinity,
                  w: layout?.w || 6,
                  h: layout?.h || 6,
                  minW: window.innerWidth >= 768 ? 4 : 1,
                  maxW: window.innerWidth >= 768 ? 12 : 1,
                  minH: 4,
                  maxH: 10
                }}
                className="touch-manipulation"
              >
                <DeviceWidget device={device} />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dashboard; 