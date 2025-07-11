# Smart Home MQTT Dashboard

A modern, responsive web-based smart home control panel built with React and Node.js, featuring real-time MQTT communication for comprehensive IoT device management.

![Smart Home Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-16+-green) ![MQTT](https://img.shields.io/badge/MQTT-5.0-orange)

## ✨ Features

### 🏠 Smart Dashboard
- **Real-time device monitoring** with interactive widgets
- **Drag-and-drop layout** customization with persistent storage
- **Responsive grid system** that adapts to all screen sizes
- **Live statistics** showing device counts, temperature averages, and system alerts
- **Dark/Light theme** with automatic detection and manual toggle
- **Customizable widgets** with resizable and repositionable cards

### 🔧 Advanced Device Management
- **Automatic device detection** based on MQTT topic patterns
- **Manual device configuration** with comprehensive device type support
- **Real-time control** for interactive devices (relays, thermostats, locks)
- **Device filtering** by type, status, room, and custom criteria
- **Live status updates** with last-seen timestamps and battery monitoring
- **Device simulation** for testing and development

### 🧪 Testing & Development Tools
- **MQTT message testing** with custom topics and JSON payloads
- **Real-time message logging** with color-coded topics and timestamps
- **Device simulation suite** with realistic data patterns
- **Auto-simulation mode** for continuous testing scenarios
- **Quick message templates** for all supported device types
- **Debug panel** with comprehensive system information

### ⚙️ Professional Configuration
- **MQTT broker connectivity** with full TLS/SSL support
- **AWS IoT Core integration** with certificate-based authentication
- **Multi-broker support** with quick test configurations
- **Certificate management** with upload and validation
- **Data export/import** for backup and migration
- **Environment-specific settings** with secure credential handling

## 🏗️ Architecture Overview

### Frontend Technology Stack
- **React 18** with modern hooks and functional components
- **TailwindCSS** for responsive, utility-first styling
- **React Router** for seamless single-page navigation
- **React Grid Layout** for drag-and-drop dashboard functionality
- **Lucide React** for consistent, beautiful iconography
- **Socket.IO Client** for real-time bidirectional communication
- **Recharts** for data visualization and analytics

### Backend Infrastructure
- **Express.js** server with RESTful API architecture
- **Socket.IO** for real-time WebSocket communication
- **MQTT.js** with full MQTT 5.0 protocol support
- **Multer** for secure file upload handling
- **fs-extra** for enhanced file system operations
- **TLS/SSL** support for secure connections

### Supported IoT Device Types
| Device Type | Icon | Features | Controllable |
|-------------|------|----------|--------------|
| 🌡️ **Temperature Sensors** | thermometer | Temperature, humidity monitoring | ❌ |
| 🚪 **Door Sensors** | door-open | Open/closed status, battery monitoring | ❌ |
| ⚡ **Smart Relays** | zap | Switch control, power monitoring | ✅ |
| 🏃 **Motion Sensors** | activity | Movement detection, timestamps | ❌ |
| 📏 **Distance Sensors** | ruler | Ultrasonic measurements, quality indicators | ❌ |
| 🏠 **Smart Thermostats** | gauge | Temperature control, mode selection | ✅ |
| 💨 **Air Quality Sensors** | wind | CO2, PM2.5, VOC, AQI monitoring | ❌ |
| 📹 **Security Cameras** | camera | Recording status, motion alerts | ❌ |
| 🔒 **Smart Locks** | lock | Lock/unlock control, user tracking | ✅ |
| 💧 **Water Leak Sensors** | droplets | Leak detection, battery status | ❌ |

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 16+** and npm
- **MQTT Broker** (local Mosquitto, cloud service, or AWS IoT Core)
- **Modern web browser** with JavaScript enabled

### Installation Steps

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd smart-home-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Start the Server**
   ```bash
   npm start
   ```

5. **Access Dashboard**
   Open your browser to `http://localhost:3000`

### Development Setup

For development with hot reloading:

```bash
# Terminal 1: Start backend with auto-restart
npm run dev

# Terminal 2: Start webpack with watch mode
npm run watch
```

## 📋 Configuration Guide

### MQTT Broker Setup

#### Option 1: Quick Test Brokers
Navigate to **Settings** → **MQTT Connection** and choose from:
- **EMQX Public** (`broker.emqx.io:1883`)
- **Eclipse Mosquitto** (`test.mosquitto.org:1883`)
- **HiveMQ Public** (`broker.hivemq.com:1883`)

#### Option 2: AWS IoT Core
1. Upload your AWS IoT certificates:
   - CA Certificate (`ca-cert.pem`)
   - Client Certificate (`client-cert.pem`)
   - Private Key (`client-key.pem`)
2. Configure your AWS IoT endpoint
3. Enable TLS/SSL connection

#### Option 3: Custom Broker
Configure your own broker with:
- **Broker Address**: Your MQTT broker URL
- **Port**: 1883 (MQTT) or 8883 (MQTTS)
- **Credentials**: Username/password if required
- **TLS/SSL**: Enable for secure connections

### Device Configuration System

The system uses `src/config/devices.json` for device definitions:

```json
{
  "device_type": {
    "topic": "home/room/device",
    "name": "Device Display Name",
    "icon": "lucide-icon-name",
    "controllable": true,
    "example": { "Key": "Value" },
    "dataKeys": ["Key1", "Key2"],
    "controls": {
      "Key": {
        "type": "toggle|slider|select",
        "states": ["ON", "OFF"]
      }
    },
    "thresholds": {
      "Key": { "min": 0, "max": 100 }
    }
  }
}
```

## 🔐 Security & Privacy

### Connection Security
- **TLS/SSL encryption** for all MQTT connections
- **Certificate-based authentication** for AWS IoT Core
- **Secure WebSocket** connections for real-time updates
- **Input validation** and sanitization on all endpoints

### Data Protection
- **Local storage only** - no cloud data transmission
- **No password persistence** in browser storage
- **Certificate encryption** for uploaded files
- **Session-based authentication** for WebSocket connections

### Privacy Features
- **Local device discovery** without external services
- **Offline-capable** dashboard functionality
- **No tracking or analytics** by default
- **Open source** for full transparency

## 🤝 MQTT Integration Guide

### Topic Structure Convention
```
home/{room}/{device_type}/{device_id}
```

**Examples:**
- `home/livingroom/temperature/sensor1`
- `home/kitchen/motion/detector1`
- `home/bedroom/door/main`

### Message Format Standards
All MQTT messages must be valid JSON:

```json
{
  "Temp": 23.5,
  "Humidity": 60,
  "Battery": 95,
  "Timestamp": "2024-01-15T10:30:00Z"
}
```

### Control Topic Separation
The system uses a clean separation between incoming and outgoing topics:

- **Incoming Data**: `home/livingroom/relay`
- **Outgoing Control**: `home/livingroom/relay_send`

This prevents command feedback loops and unwanted device creation.

### Auto-Detection Logic
Devices are automatically detected when:
1. **Topic patterns** match known device types
2. **Message structure** contains expected data keys
3. **Recent activity** is detected on new topics
4. **Topic excludes** "_send" suffix (control topics)

## 📱 Responsive Design

The dashboard provides optimal experience across all devices:

| Device Type | Screen Size | Features |
|-------------|-------------|----------|
| **Desktop** | 1200px+ | Full drag-and-drop, all widgets, sidebar navigation |
| **Tablet** | 768-1199px | Touch-optimized controls, collapsible sidebar |
| **Mobile** | <768px | Simplified layout, bottom navigation, swipe gestures |

**Theme Support:**
- **Auto-detection** based on system preferences
- **Manual toggle** with persistent storage
- **Consistent styling** across all components
- **High contrast** mode support

## 🛠️ Development Guide

### Project Structure
```
smart-home-dashboard/
├── src/
│   ├── components/
│   │   ├── devices/         # Device widgets and controls
│   │   ├── layout/          # Navigation and layout components
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React context providers
│   │   ├── DeviceContext.js # Device state management
│   │   ├── MqttContext.js   # MQTT connection handling
│   │   └── ThemeContext.js  # Theme and UI state
│   ├── pages/               # Main application pages
│   │   ├── Dashboard.js     # Main dashboard with widgets
│   │   ├── Devices.js       # Device management page
│   │   └── Settings.js      # Configuration interface
│   ├── config/              # Configuration files
│   │   ├── devices.json     # Device type definitions
│   │   ├── message-formats.json # MQTT message templates
│   │   └── bc.json          # Broker configurations
│   └── styles/              # Global styles and themes
├── public/                  # Static assets and built files
├── uploads/                 # Certificate and file storage
├── server.js               # Express server and MQTT handling
└── webpack.config.js       # Build and development configuration
```

### Available Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start production server on port 3000 |
| `npm run dev` | Start development server with auto-restart |
| `npm run build` | Build React app for production |
| `npm run build:dev` | Build in development mode |
| `npm run watch` | Build with file watching for development |

### Adding New Device Types

1. **Define Device Configuration**
   Update `src/config/devices.json` with new device type:
   ```json
   {
     "new_device": {
       "topic": "home/room/newdevice",
       "name": "New Device Type",
       "icon": "device-icon",
       "example": { "Status": "Active" },
       "dataKeys": ["Status"]
     }
   }
   ```

2. **Add Icon Support**
   Ensure the icon exists in `src/components/ui/Icon.js`

3. **Test Message Format**
   Use the Testing page to send sample messages and verify detection

4. **Update Documentation**
   Add the new device type to relevant documentation

## 🔧 Troubleshooting

### Connection Issues

**MQTT Connection Failed**
- ✅ Verify broker address and port are correct
- ✅ Check firewall settings allow outbound connections
- ✅ Validate TLS/SSL certificate configuration
- ✅ Test with public brokers first (e.g., `broker.hivemq.com`)

**WebSocket Connection Failed**
- ✅ Check browser console for errors
- ✅ Verify server is running on correct port
- ✅ Clear browser cache and restart server
- ✅ Check for conflicting browser extensions

### Device Management Issues

**Devices Not Appearing**
- ✅ Verify MQTT messages are properly formatted JSON
- ✅ Check topic structure matches expected patterns
- ✅ Ensure device is publishing to correct topics
- ✅ Use Testing page to simulate device messages
- ✅ Check browser console for JavaScript errors

**Device Controls Not Working**
- ✅ Verify device is marked as `"controllable": true`
- ✅ Check control topic uses "_send" suffix
- ✅ Confirm MQTT broker receives control messages
- ✅ Validate control message format matches device expectations

**Layout Not Saving**
- ✅ Check browser local storage permissions
- ✅ Verify JavaScript is enabled
- ✅ Clear browser data and reconfigure
- ✅ Check browser compatibility (modern browsers required)

### Performance Issues

**Slow Dashboard Loading**
- ✅ Check number of active devices (>50 may impact performance)
- ✅ Verify MQTT message frequency isn't too high
- ✅ Clear browser cache and local storage
- ✅ Consider reducing widget complexity

**High Memory Usage**
- ✅ Check for memory leaks in browser dev tools
- ✅ Restart server if long-running
- ✅ Monitor MQTT message retention settings
- ✅ Consider pagination for large device lists

### Debug Mode

Enable detailed logging:

```bash
# Server-side MQTT debugging
DEBUG=mqtt* npm start

# Enable browser debug mode
localStorage.setItem('debug', 'true')
```

## 📊 System Requirements

### Minimum Requirements
- **Node.js**: 16.0 or higher
- **RAM**: 512MB available
- **Storage**: 100MB for application and logs
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Recommended Specifications
- **Node.js**: 18.0 or higher
- **RAM**: 1GB available
- **Storage**: 500MB for certificates and data
- **Network**: Stable internet for cloud MQTT brokers

### Supported Platforms
- **Windows**: 10, 11 (x64)
- **macOS**: 10.15+ (Intel/Apple Silicon)
- **Linux**: Ubuntu 18.04+, Debian 10+, CentOS 7+
- **Docker**: Compatible with containerized deployments

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

## 🎯 Roadmap

### Planned Features
- [ ] **Database integration** for historical data storage
- [ ] **User authentication** and multi-user support
- [ ] **Mobile app** with React Native
- [ ] **Device grouping** and room management
- [ ] **Automation rules** and scripting engine
- [ ] **Push notifications** for alerts and events

### Recent Updates
- ✅ **Control topic separation** with "_send" suffix
- ✅ **AWS IoT Core** certificate support
- ✅ **Device simulation** testing suite
- ✅ **Responsive design** optimization
- ✅ **Theme system** implementation

## 🙏 Acknowledgments

Built with these excellent open-source projects:
- **[MQTT.js](https://github.com/mqttjs/MQTT.js)** - Robust MQTT client library
- **[React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)** - Drag-and-drop grid system
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev)** - Beautiful icon library
- **[Socket.IO](https://socket.io)** - Real-time communication
- **[Recharts](https://recharts.org)** - Data visualization components

## 📞 Support & Contributing

### Getting Help
1. **Check troubleshooting guide** above for common issues
2. **Review [Issues](../../issues)** for similar problems
3. **Create detailed issue** with system information and logs
4. **Join community discussions** for general questions

### Contributing
1. **Fork the repository** and create feature branch
2. **Follow coding standards** and add tests
3. **Update documentation** for new features
4. **Submit pull request** with detailed description

---

**🏠 Built with passion for the IoT and Smart Home community**

*Transform your home into a smart, connected environment with real-time monitoring and control.*