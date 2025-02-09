import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (token !== null) {
      return token;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
  }
};

export default getToken;
