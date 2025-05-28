import { useState, useEffect, useContext, useRef } from "react";
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
import { BinsContext } from "./BinsContext";
import { Linking } from "react-native";
import getToken from "./Token";

const REFRESH_INTERVAL = 30000; // 30 secondes

export default function MainScreen({ navigation }) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayRoute, setDisplayRoute] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const { bins, setBins, profile, setProfile } = useContext(BinsContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newBin, setNewBin] = useState({
    latitude: null,
    longitude: null,
    title: "",
  });
  
  // Référence pour stocker l'intervalle
  const refreshIntervalRef = useRef(null);

  const fetchBinsInitial = async () => {
    try {
      console.log("🔄 Fetching bins positions...");
      const response = await axios.get(
         `${URL}/api/bins`
      );
      // On attend que l'API renvoie un tableau d'objets contenant au moins { name, latitude, longitude, fillPercentage }
      if (response.data && Array.isArray(response.data)) {
        setBins(response.data);
        console.log("✅ Bins positions fetched successfully!");
      } else {
        console.error("Invalid data received from server!");
      }
    } catch (error) {
      console.error("Error fetching bins positions:", error);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;
      
      console.log("🔄 Calling Geocoding API...");
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        console.log("✅ Call to Geocoding API successful !");
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        console.error("Geocoding error:", response.data.status);
        return null;
      }
    } catch (error) {
      console.error("Error in geocoding:", error);
      return null;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Erreur", "Vous devez vous connecter.");
        return;
      }

      console.log("🔄 Récupération des informations utilisateur...");
      const response = await axios.get(`${URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Mettre à jour le profil avec les informations récupérées
        setProfile(prevProfile => ({...prevProfile, name: response.data.username, email: response.data.email}));
        console.log("✅ Informations utilisateur récupérées avec succès !");
      } else {
        console.error("Erreur lors de la récupération des informations utilisateur:", response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur:", error);
    }
  };

  // Fonction de rafraîchissement des données
  const handleRefresh = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    
    try {
      // 1. Recharger les bins depuis l'API
      await fetchBinsInitial();

      // 2. Récupérer les informations utilisateur
      await fetchUserInfo();

      // 3. Recalculer la position de la maison via geocodeAddress
      if (profile.stationAdress) {
        const coords = await geocodeAddress(profile.stationAdress);
        if (coords) {
          setProfile(prevProfile => ({...prevProfile, startingPoint: `${coords.latitude},${coords.longitude}`}));
        } else {
          console.log("❌ Erreur lors de la géocodification");
        }
    
        // 4. Réinitialiser l'itinéraire si nécessaire
        if (showLoading) {
          setRouteCoordinates([]);
          setDisplayRoute(false);
        }
      }
    } catch (error) {
      console.error("Erreur dans le refresh :", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };  

  // Configuration du rafraîchissement initial et automatique
  useEffect(() => {
    // Premier chargement avec indicateur de chargement
    handleRefresh(true);

    // Mettre en place l'intervalle de rafraîchissement automatique
    refreshIntervalRef.current = setInterval(() => {
      handleRefresh(false); // Pas d'indicateur de chargement pour les rafraîchissements automatiques
    }, REFRESH_INTERVAL);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Géocodification lors du changement d'adresse
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchBinsInitial();
      await fetchUserInfo();
      
      if (profile.stationAdress) {
        try {
          const coords = await geocodeAddress(profile.stationAdress);
          if (coords) {
            setProfile(prevProfile => ({
              ...prevProfile, 
              startingPoint: `${coords.latitude},${coords.longitude}`
            }));
          }
        } catch (error) {
          console.error("Erreur lors de la géocodification:", error);
        }
      }
      setLoading(false);
    };
    
    initializeData();
  }, []);

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

      const filledBins = bins.filter((bin) => bin.fillLevel >= 80);

      if (filledBins.length === 0) {
        Alert.alert("Error", "No bins are filled to 80% or more!");
        setLoading(false);
        return;
      }

      const origin = profile.startingPoint; // Start at the same address
      const destination = profile.startingPoint; // End at the same address

      // Collect coordinates for all bins as waypoints
      const waypointCoordinates = filledBins
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
      
      console.log("🔄 Calling Directions API...");
      const response = await axios.get(url);
      console.log("✅ Call to Directions API successful !");
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
        console.log("✅ Route decoded successfully !");
        setTimeout(() => {
          Alert.alert(
            "Itinerary Calculated",
            "Check the map for the optimal route!",
            [
              { text: "Google Maps", onPress: openGoogleMapsWithOptimizedWaypoints },
              { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
          );
        }, 100);
        setRouteCoordinates(points);
        setDisplayRoute(true);
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

  // Gestion du bouton "Calculate Itinerary / Toggle Itinerary"
  const handleItineraryButtonPress = async () => {
    // Si aucun itinéraire n'est encore calculé, lance la requête et affiche l'itinéraire immédiatement.
    if (routeCoordinates.length === 0) {
      await fetchRoute();
    } else {
      // Sinon, bascule l'affichage de l'itinéraire
      setDisplayRoute(!displayRoute);
    }
  };

  const handleSaveProfile = () => {
    setProfile(profile);
    console.log("✅ Profile saved:", profile);
    Alert.alert("Profile Saved", "Your profile modifications have been saved.");
    setProfileModalVisible(false);
  };  

  const openGoogleMapsWithOptimizedWaypoints = async () => {

    const filledBins = bins.filter((bin) => bin.fillLevel >= 80);

    // Assurez-vous que bins contient bien vos bins et que la réponse de l'API Directions est disponible
    if (!filledBins || filledBins.length === 0) {
      Alert.alert("Erreur", "Aucun bin disponible pour calculer l'itinéraire.");
      return;
    }
    
    // Construit le tableau d'origine des waypoints à partir des bins
    const originalWaypoints = filledBins.map(bin => `${bin.latitude},${bin.longitude}`);
    
    // Supposons que vous avez déjà obtenu la réponse de l'API Directions (par exemple, dans une variable response)
    // Ici, on simule la récupération de l'ordre optimisé depuis la réponse
    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${profile.startingPoint}&destination=${profile.startingPoint}&waypoints=optimize:true|${originalWaypoints.join("|")}&key=${GOOGLE_MAPS_API_KEY}`);
    
    if (response.data.status !== "OK") {
      Alert.alert("Erreur", `Directions API returned status: ${response.data.status}`);
      return;
    }
    
    const optimizedOrder = response.data.routes[0].waypoint_order;
    const optimizedWaypoints = optimizedOrder.map(index => originalWaypoints[index]);
    
    const origin = profile.startingPoint;
    const destination = profile.startingPoint;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${optimizedWaypoints.join("|")}&travelmode=driving&dir_action=navigate`;
    
    console.log("🔄 Opening Google Maps with optimized waypoints...");
    Linking.canOpenURL(googleMapsUrl)
      .then((supported) => {
        if (supported) {
          console.log("✅ Opening Google Maps...");
          Linking.openURL(googleMapsUrl);
        } else {
          Alert.alert("Erreur", "Google Maps n'est pas disponible sur cet appareil.");
        }
      })
      .catch((err) => console.error("Erreur lors de l'ouverture de Google Maps:", err));
  };  

  const getFillColor = (fillLevel) => {
    if (fillLevel < 50) return "green";
    else if (fillLevel < 80) return "orange";
    else return "red";
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
        <TouchableOpacity onPress={() => {
          setProfileModalVisible(true);
        }}>
          <Image
            source={require("../assets/account.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Indicateur de mise à jour automatique */}
      {loading && (
        <View style={styles.autoRefreshIndicator}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.autoRefreshText}>Mise à jour...</Text>
        </View>
      )}

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.3851,
          longitude: 2.1734,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // onLongPress={handleLongPress}
      >
        {bins.map((bin, index) => (
        <Marker
          key={bin.name}
          coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
          pinColor={bin.fillLevel >= 80 ? "red" : "green"}
        >
          <Callout>
          <View style={styles.calloutContainer}>
            {/* Partie gauche avec les informations */}
            <View style={styles.calloutInfo}>
              <Text style={styles.calloutTitle}>{bin.name}</Text>
              <Text style={styles.calloutText}>Fill Level: {bin.fillLevel}%</Text>
            </View>

            {/* Partie droite avec la barre de progression */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${bin.fillLevel}%`,
                    backgroundColor: getFillColor(bin.fillLevel),
                  },
                ]}
              />
            </View>
          </View>
        </Callout>
        </Marker>
        ))}

        {profile.startingPoint && profile.startingPoint.includes(',') && (
          <Marker
            coordinate={{
              latitude: parseFloat(profile.startingPoint.split(',')[0]),
              longitude: parseFloat(profile.startingPoint.split(',')[1])
            }}
            title="Recycling Station"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <FontAwesome5 name="home" size={30} color="#000000FF" />
          </Marker>
        )}

        {displayRoute && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#0000FF"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Bottom Navigation - Bouton de rafraîchissement supprimé */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.calculateButtonWide}
          onPress={handleItineraryButtonPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.calculateText}>
              {routeCoordinates.length === 0
                ? "Calculate Itinerary"
                : displayRoute
                ? "Hide Itinerary"
                : "Display Itinerary"}
            </Text>
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
            <Text style={styles.modalTitle}>Profile Information</Text>
            <Text style={styles.modalSubTitle}>Name: </Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Name"
              value={profile.name}
              editable={false}
            />
            <Text style={styles.modalSubTitle}>Email: </Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Email"
              value={profile.email}
              editable={false}
            />
            <Text style={styles.modalSubTitle}>Recycling station: </Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              placeholder="Recycling station"
              value={profile.stationAdress}
              editable={false}
            />
            <View style={[styles.modalActions, { justifyContent: "center" }]}>
              <TouchableOpacity
                style={[styles.closeButton, { width: '80' }]}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
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
  calculateButton: {
    backgroundColor: "#001F3F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 0,
    alignItems: "center",
    height: 50,
  },
  calculateButtonWide: {
    backgroundColor: "#001F3F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 0,
    alignItems: "center",
    height: 50,
    width: "80%", // Version plus large sans le bouton de rafraîchissement
  },
  calculateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
  readOnlyInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
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
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#5cb85c",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  saveButtonText: {
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
  bottomNav: {
    position: "relative",
    height: 100,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  // Styles pour l'indicateur de rafraîchissement automatique
  autoRefreshIndicator: {
    position: "absolute",
    top: 120, // Juste en dessous du header
    right: 20,
    backgroundColor: "rgba(0, 31, 63, 0.7)",
    borderRadius: 20,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
  },
  autoRefreshText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 5,
  },
  progressBarContainer: {
    width: 100,       // largeur fixe de la barre
    height: 10,       // hauteur de la barre
    backgroundColor: "#e0e0e0", // couleur de fond (barre vide)
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  calloutContainer: {
    padding: 5,
    minWidth: 150,
  },
  calloutInfo: {
    marginBottom: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutText: {
    fontSize: 14,
  },
});