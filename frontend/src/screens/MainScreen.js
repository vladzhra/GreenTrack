import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MainScreen() {
  const [itinerary, setItinerary] = useState([]);

  // Function to calculate the itinerary
  const calculateItinerary = () => {
    // Simulate a calculated itinerary (in order)
    const newItinerary = [
      { latitude: 41.3861, longitude: 2.1744 }, // Bin 1
      { latitude: 41.3871, longitude: 2.1754 }, // Bin 2
      { latitude: 41.3881, longitude: 2.1764 }, // Bin 3
      { latitude: 41.3860156, longitude: 2.1774 }, // Bin 4
    ];
    setItinerary(newItinerary);
    Alert.alert("Itinerary Calculated", "Check the map for the route!");
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
        {/* Exemple de marqueurs */}
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

        {/* Display Itinerary Polyline */}
        {itinerary.length > 0 && (
          <Polyline
            coordinates={itinerary}
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
          onPress={calculateItinerary}
        >
          <Text style={styles.calculateText}>Calculate Itinerary</Text>
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
