import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "@env";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        return Alert.alert("Erreur", "Veuillez remplir tous les champs");
      }
      console.log("URL", URL);
      const response = await axios.post(`${URL}/api/auth/login`, {
        email: email,
        password: password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        await AsyncStorage.setItem("authToken", token);
        Alert.alert("Login success");
        navigation.navigate("MainScreen");
      } else {
        Alert.alert("Erreur", response.data.message || "Identifiants incorrects");
      }
    } catch (error) {
      console.error("Full Error:", error);
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Une erreur est survenue");
      }
    }
    // navigation.navigate("MainScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>
        Pas de compte ?{" "}
        <Text
          style={styles.clickableText}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          Inscrivez-vous ici
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#001F3F",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomText: {
    marginTop: 20,
    color: "#000",
  },
  clickableText: {
    color: "#001F3F",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
