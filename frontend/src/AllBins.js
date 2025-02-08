import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { BinsContext } from "./BinsContext";

const AllBins = ({ navigation }) => {
  const { bins } = useContext(BinsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Bins</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("MainScreen")}
        style={{ position: "absolute", top: 50, left: 30 }}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={bins}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.binItem}>
            <Text style={styles.binName}>{item.name}</Text>
            <Text style={styles.binAdress}>
              Adress: {item.adress}
            </Text>
            <Text style={styles.binDetails}>
              Latitude: {item.latitude}, Longitude: {item.longitude}
            </Text>
            <Text style={styles.binDetails}>
              Fill Percentage: {item.fillLevel}%
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  binItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  binName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  binDetails: {
    fontSize: 14,
    color: "#555",
  },
});

export default AllBins;
