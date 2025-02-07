import { use, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView from "react-native-maps";
import { Marker, Polyline, Callout } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { URL } from "@env";

// Constante avec toutes les bins
// const binsData = [
//   { name: "Bin 1", latitude: 41.3861, longitude: 2.1744, fillPercentage: 75 },
//   {
//     name: "Bin 2",
//     latitude: 41.379443,
//     longitude: 2.188807,
//     fillPercentage: 50,
//   },
//   {
//     name: "Bin 3",
//     latitude: 41.403499,
//     longitude: 2.175391,
//     fillPercentage: 90,
//   },
//   {
//     name: "Bin 4",
//     latitude: 41.3860156,
//     longitude: 2.1774,
//     fillPercentage: 30,
//   },
//   { name: "Bin 5", latitude: 41.37724, longitude: 2.174436, fillPercentage: 0 },
//   {
//     name: "Bin 6",
//     latitude: 41.381185,
//     longitude: 2.166791,
//     fillPercentage: 0,
//   },
//   {
//     name: "Bin 7",
//     latitude: 41.384002,
//     longitude: 2.157982,
//     fillPercentage: 20,
//   },
//   {
//     name: "Bin 8",
//     latitude: 41.391047,
//     longitude: 2.194118,
//     fillPercentage: 100,
//   },
//   {
//     name: "Bin 9",
//     latitude: 41.397422,
//     longitude: 2.183468,
//     fillPercentage: 70,
//   },
// ];

export default function MainScreen({ navigation }) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    startingPoint: "41.391038,2.194041" // epitech Barcelona
  });
  const [bins, setBins] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newBin, setNewBin] = useState({
    latitude: null,
    longitude: null,
    title: "",
  });

  // -------------------------------
  // 1. Récupération initiale des positions et noms des bins
  // -------------------------------
  const fetchBinsInitial = async () => {
    try {
      const response = await axios.get(
         `${URL}/api/bins`
      );
      // On attend que l'API renvoie un tableau d'objets contenant au moins { name, latitude, longitude, fillPercentage }
      if (response.data && Array.isArray(response.data)) {
        setBins(response.data);
        console.log("Bins fetched:", response.data);
      } else {
        Alert.alert("Error", "Invalid data received from server!");
      }
    } catch (error) {
      console.error("Error fetching bins positions:", error);
      Alert.alert("Error", "Failed to fetch initial bins positions!");
    }
  };

  useEffect(() => {
    fetchBinsInitial();
  }, []);

  const handleLongPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewBin({ latitude, longitude, title: "" });
    setModalVisible(true);
  };

  const handleAddBin = () => {
    if (newBin.title.trim()) {
      setBins([...bins, newBin]);
      setModalVisible(false);
      setNewBin({ latitude: null, longitude: null, title: "" });
      Alert.alert("Bin Added", "New bin added to the map.");
    } else {
      Alert.alert("Error", "Please provide a title for the bin.");
    }
  };

  // Function to fetch the optimal route that starts/ends at your address and passes through every bin
  const fetchRoute = async () => {
    setLoading(true);
    try {
      // Ensure there is at least one bin
      if (bins.length === 0) {
        Alert.alert("Error", "No bins available!");
        setLoading(false);
        return;
      }

      // Use the user's address from profile as the starting point.
      // encodeURIComponent makes sure the address is URL safe.
      // const startingAddress = encodeURIComponent(profile.startingPoint);
      const origin = "41.391038,2.194041";
      const destination = "41.391038,2.194041"; // End at the same address

      // Collect coordinates for all bins as waypoints
      const waypointCoordinates = bins
        .map((bin) => `${bin.latitude},${bin.longitude}`)
        .join("|");

      // Use "optimize:true" so Google reorders the waypoints for the optimal route.
      const waypoints = waypointCoordinates
        ? `optimize:true|${waypointCoordinates}`
        : "";

      // Build the URL for the Google Directions API request.
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${
        waypoints ? `&waypoints=${waypoints}` : ""
      }&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await axios.get(url);
      console.log("Google Directions API response:", response.data);
      if (response.data.status !== "OK") {
        Alert.alert("Erreur", `Directions API returned status: ${response.data.status}`);
        setLoading(false);
        return;
      }
      if (response.data.routes && response.data.routes.length) {
        // Decode the polyline returned by the API
        const points = decodePolyline(
          response.data.routes[0].overview_polyline.points
        );
        setRouteCoordinates(points);
        Alert.alert(
          "Itinerary Calculated",
          "Check the map for the optimal route!"
        );
      } else {
        Alert.alert("Error", "No route found!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch the route!");
    }
    setLoading(false);
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("AllBins")}>
          <MaterialIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerText}>Collection Route</Text>
          <Text style={styles.subHeaderText}>SCANIA 13</Text>
        </View>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <Image
            source={require("../assets/account.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.3851,
          longitude: 2.1734,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={handleLongPress}
      >
        {bins.map((bin, index) => (
          <Marker
          key={bin.name}
          coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
        >
          <Callout>
            <View style={{ width: 100, padding: 5, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>{bin.name}</Text>
              <Text style={{textAlign: "center"}}>Fill Level: {bin.fillLevel}%</Text>
              {/* Vous pouvez ajouter d'autres informations ici */}
            </View>
          </Callout>
        </Marker>
        ))}

        <Marker
          coordinate={{ latitude: 41.391038, longitude: 2.194041 }}
          title="Recycling Station"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <FontAwesome5 name="home" size={30} color="#000000FF" />
        </Marker>

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={fetchRoute}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.calculateText}>Calculate Itinerary</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.allBinsButton}
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate("AllBins");
              }}
            >
              <MaterialIcons name="list" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile</Text>
            <Text style={styles.modalSubTitle}>Name: </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
            <Text style={styles.modalSubTitle}>Email: </Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
            />
            <Text style={styles.modalSubTitle}>Recycling station: </Text>
            <TextInput
              style={styles.input}
              placeholder="Recycling station"
              value={profile.startingPoint}
              onChangeText={(text) =>
                setProfile({ ...profile, startingPoint: text })
              }
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {
                setProfileModalVisible(false);
                navigation.navigate("Settings");
              }}
            >
              <MaterialIcons name="settings" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Bin Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bin</Text>
            <TextInput
              style={styles.input}
              placeholder="Bin Title"
              placeholderTextColor="gray"
              value={newBin.title}
              onChangeText={(text) => setNewBin({ ...newBin, title: text })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAddBin}>
                <Text style={styles.addButtonText}>Add Bin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  allBinsButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    top: 12,
    left: 12,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "20%",
  },
  calculateButton: {
    flex: 2,
    backgroundColor: "#001F3F",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalSubTitle: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 20,
  },
  settingsButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4F46E5",
    padding: 7,
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#001F3F",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#5cb85c",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
