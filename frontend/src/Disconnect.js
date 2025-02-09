import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const handleDisconnect = async (navigation) => {
  try {
    // Suppression du token d'authentification
    await AsyncStorage.removeItem("authToken");
    console.log("🔐 Token supprimé avec succès");

    // Redirection vers l'écran de connexion
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });

    console.log("🔓 Déconnecté et redirigé vers l'écran de connexion");
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion :", error);
    Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion.");
  }
};

export default handleDisconnect;