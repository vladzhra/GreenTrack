import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Collection Route</Text>
        <Text style={styles.subHeaderText}>SCANIA 13</Text>
        <Image
          source={require("../assets/account.png")}
          style={styles.avatar}
        />
      </View>

      {/* Carte */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.3851, // Latitude of Barcelona
          longitude: 2.1734, // Longitude of Barcelona
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
          coordinate={{ latitude: 41.3891, longitude: 2.1774 }}
          title="Bin 4"
        />
      </MapView>

      {/* Barre de navigation inférieure */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calculateButton}>
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
