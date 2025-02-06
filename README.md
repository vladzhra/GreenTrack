# GreenTrack

GreenTrack is an innovative solution to optimize urban waste management using technologies based on Artificial Intelligence (AI) and the Internet of Things (IoT). This project aims to reduce costs, improve the efficiency of waste collection, and promote a cleaner environment.

## Features

- **Real-time monitoring**: Sensors installed on the bins allow to monitor the filling level in real time.
- **Route optimization**: Generation of efficient routes to reduce fuel consumption and collection time.
- **Interactive map**: Displays full and empty bins on a map for easy management.
- **Notifications**: Automatic alerts to avoid overflowing bins.
- **Intuitive user interface**: A mobile application with simple navigation and actionable data.

## Technologies used

- **Frontend** : React Native
- **Backend** : Node.js with Express
- **Database** : PostgreSQL
- **Hardware** : HC-SR04 distance sensors, ESP32, rechargeable batteries
- **Map** : `react-native-maps` library

## Installation and configuration

### Prerequisites

- Node.js installed on your machine
- Expo CLI (if you use Expo): `npm install -g expo-cli`
- PostgreSQL for the database

### Installation

1. Clone this repository:

```bash
git clone https://github.com/your-repo/greentrack.git
cd greentrack
```

2. Install the project dependencies:

```bash
npm install
```

3. Launch the mobile application:

```bash
npx expo start --tunnel
```

4. Scan the QR code with the Expo Go app on your phone.

## Usage

1. Open the mobile app to see the bins on the map.
2. Click "Calculate Itinerary" to generate the optimal route.
3. Get notified when the bins are nearing capacity.

## Contribute

1. Fork this repository.
2. Branch your feature: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push your changes: `git push origin feature/your-feature-name`
5. Open a Pull Request.

## Team

- **Thomas Fiancette** - Hardware Manager
- **Fred Tossou** - Hardware
- **Mordecai Zossoungbo** - Backend
- **Vlad Zaharia** - Frontend Leader
- **Lucas Palazuelo** - Frontend
- **Vincent Ballandi** - Backend Leader
- **Mathias Ballot** - Hardware
