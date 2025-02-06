import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function SettingsScreen({ navigation }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleSaveSettings = () => {
    Alert.alert("Settings Saved", "Your preferences have been updated!");
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <TouchableOpacity
        style={styles.containerBackArrow}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
      </TouchableOpacity>
      <Text style={[styles.header, isDarkTheme && styles.darkText]}>
        Settings
      </Text>

      {/* Settings Group */}
      <View style={styles.settingsGroup}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>
          Dark Theme
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={setIsDarkTheme}
          thumbColor={isDarkTheme ? "#4CAF50" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      <View style={styles.settingsGroup}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>
          Notifications
        </Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={setIsNotificationsEnabled}
          thumbColor={isNotificationsEnabled ? "#4CAF50" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      <View style={styles.settingsGroup}>
        <Text style={[styles.label, isDarkTheme && styles.darkText]}>
          Language
        </Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
          style={[
            styles.picker,
            isDarkTheme ? styles.darkPicker : styles.lightPicker,
          ]}
        >
          <Picker.Item label="English" value="English" />
          <Picker.Item label="Spanish" value="Spanish" />
          <Picker.Item label="French" value="French" />
        </Picker>
      </View>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isDarkTheme && styles.darkSaveButton]}
          onPress={handleSaveSettings}
        >
          <Text
            style={[
              styles.saveButtonText,
              isDarkTheme && styles.darkSaveButtonText,
            ]}
          >
            Save Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120,
    backgroundColor: "#F5F5F5",
  },
  containerBackArrow: {
    position: "absolute",
    top: 70,
    left: 18,
    zIndex: 1,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  darkText: {
    color: "#FFF",
  },
  settingsGroup: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  picker: {
    width: "50%",
    height: 50,
  },
  lightPicker: {
    color: "#333",
  },
  darkPicker: {
    color: "#FFF",
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  darkSaveButton: {
    backgroundColor: "#357A38",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  darkSaveButtonText: {
    color: "#FFF",
  },
});
