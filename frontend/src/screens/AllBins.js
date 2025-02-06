import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const binsData = [
  { name: "Bin 1", latitude: 41.3861, longitude: 2.1744, fillPercentage: 75 },
  {
    name: "Bin 2",
    latitude: 41.379443,
    longitude: 2.188807,
    fillPercentage: 50,
  },
  {
    name: "Bin 3",
    latitude: 41.403499,
    longitude: 2.175391,
    fillPercentage: 90,
  },
  {
    name: "Bin 4",
    latitude: 41.3860156,
    longitude: 2.1774,
    fillPercentage: 30,
  },
  { name: "Bin 5", latitude: 41.37724, longitude: 2.174436, fillPercentage: 0 },
  {
    name: "Bin 6",
    latitude: 41.381185,
    longitude: 2.166791,
    fillPercentage: 0,
  },
  {
    name: "Bin 7",
    latitude: 41.384002,
    longitude: 2.157982,
    fillPercentage: 20,
  },
  {
    name: "Bin 8",
    latitude: 41.391047,
    longitude: 2.194118,
    fillPercentage: 100,
  },
  {
    name: "Bin 9",
    latitude: 41.397422,
    longitude: 2.183468,
    fillPercentage: 70,
  },
];

const AllBins = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Bins</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", top: 50, left: 30 }}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={binsData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.binItem}>
            <Text style={styles.binName}>{item.name}</Text>
            <Text style={styles.binDetails}>
              Latitude: {item.latitude}, Longitude: {item.longitude}
            </Text>
            <Text style={styles.binDetails}>
              Fill Percentage: {item.fillPercentage}%
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
