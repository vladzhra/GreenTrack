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
import { URL } from "@env";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${URL}/api/auth/register`, {
        username: username,
        email: email,
        password: password,
      });
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Register success");
        navigation.navigate("LoginScreen");
      } else {
        Alert.alert("Erreur", response.data.message || "Identifiants incorrects");
      }
    } catch (error) {
      console.error("Full Error:", error);
      if (error.response) {
        Alert.alert("Erreur", error.response.data.message || "Une erreur est survenue");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>
        Vous avez déjà un compte ?{" "}
        <Text
          style={styles.clickableText}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Connectez-vous ici
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
    color: "#000",
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

export default RegisterScreen;
