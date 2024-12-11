import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

export default function MainScreen() {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Remplacez par votre clé API

  // Function to fetch route from Google Directions API
  const fetchRoute = async () => {
    setLoading(true);
    try {
      const origin = "41.3861,2.1744"; // Point de départ (latitude,longitude)
      const destination = "41.3860156,2.1774"; // Destination (latitude,longitude)
      const waypoints = "41.3871,2.1754|41.3881,2.1764"; // Points intermédiaires (séparés par |)

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await axios.get(url);
      if (response.data.routes.length) {
        const points = decodePolyline(
          response.data.routes[0].overview_polyline.points
        );
        setRouteCoordinates(points);
        Alert.alert("Itinerary Calculated", "Check the map for the route!");
      } else {
        Alert.alert("Error", "No route found!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch the route!");
    }
    setLoading(false);
  };

  // Function to decode polyline
  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Collection Route</Text>
        <Text style={styles.subHeaderText}>SCANIA 13</Text>
        <Image
          source={require("../../assets/account.png")}
          style={styles.avatar}
        />
      </View>

      {/* Carte */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.3851,
          longitude: 2.1734,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marqueurs */}
        <Marker
          coordinate={{ latitude: 41.3861, longitude: 2.1744 }}
          title="Bin 1"
        />
        <Marker
          coordinate={{ latitude: 41.3871, longitude: 2.1754 }}
          title="Bin 2"
        />
        <Marker
          coordinate={{ latitude: 41.3881, longitude: 2.1764 }}
          title="Bin 3"
        />
        <Marker
          coordinate={{ latitude: 41.3860156, longitude: 2.1774 }}
          title="Bin 4"
        />

        {/* Itinéraire */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#0000FF" // Blue line
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Barre de navigation inférieure */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={fetchRoute}
          disabled={loading}
        >
          <Text style={styles.calculateText}>
            {loading ? "Calculating..." : "Calculate Itinerary"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#001F3F",
    paddingTop: 60,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "white",
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  map: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    marginTop: -20,
  },
  navText: {
    color: "#001F3F",
    fontSize: 16,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 8,
    marginTop: -20,
    alignItems: "center",
  },
  calculateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
