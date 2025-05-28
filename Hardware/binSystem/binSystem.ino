/*
 * GreenTrack Waste Bin Monitoring System - REAL-TIME MODE
 * Envoi du niveau de la poubelle toutes les 5 secondes
 */

 #include <WiFi.h>
 #include <HTTPClient.h>
 #include <ArduinoJson.h>
 
 // ===== CONFIGURATION =====
 const char* ssid = "flemme02";
 const char* password = "12345789";
 const char* serverUrl = "http://10.48.255.111:3000/api/bins"; // URL de votre API backend
 const int binId = 2; // ID unique de cette poubelle
 const float emptyBinDistance = 50.0; // Distance en cm quand la poubelle est vide
 const int updateInterval = 5; // Secondes entre chaque envoi (5 secondes)
 
 // Configuration des pins pour HC-SR04
 const int trigPin = 5; // GPIO 5
 const int echoPin = 18; // GPIO 18
 
 // Variables
 int fillLevel = 0.0;
 int readingCount = 0;
 
 void setup() {
   // Initialisation de la communication série
   Serial.begin(115200);
   
   // Initialisation des pins du capteur
   pinMode(trigPin, OUTPUT);
   pinMode(echoPin, INPUT);
   
   // Attendre que le port série s'initialise
   delay(1000);
   
   Serial.println("\n\n=====================================");
   Serial.println("GreenTrack - MODE TEMPS RÉEL");
   Serial.println("Envoi du niveau toutes les 5 secondes");
   Serial.println("=====================================");
   
   // Se connecter au WiFi
   connectToWiFi();
 }
 
 void loop() {
   // Mesurer le niveau de remplissage
   fillLevel = measureFillLevel();
   
   // Incrémenter le compteur de lectures
   readingCount++;
   
   // Afficher les informations
   Serial.print("Lecture #");
   Serial.print(readingCount);
   Serial.print(" | Niveau: ");
   Serial.print(fillLevel);
   Serial.println("%");
   
   // Envoyer les données au serveur à chaque cycle
   if (WiFi.status() == WL_CONNECTED) {
     Serial.println("Envoi des données au serveur...");
     sendDataToServer();
     Serial.println("----------------");
   } else {
     Serial.println("WiFi non connecté, reconnexion...");
     WiFi.reconnect();
   }
   
   // Attendre 5 secondes avant la prochaine lecture/envoi
   Serial.println("Attente de " + String(updateInterval) + " secondes...");
   delay(updateInterval * 1000);
 }
 
 void connectToWiFi() {
   Serial.print("Connexion au WiFi ");
   WiFi.begin(ssid, password);
   
   int attempts = 0;
   while (WiFi.status() != WL_CONNECTED && attempts < 20) {
     delay(500);
     Serial.print(".");
     attempts++;
   }
   
   if (WiFi.status() == WL_CONNECTED) {
     Serial.println("\nWiFi connecté");
     Serial.print("Adresse IP: ");
     Serial.println(WiFi.localIP());
   } else {
     Serial.println("\nÉchec de connexion au WiFi");
   }
 }
 
 float measureFillLevel() {
   // Prendre plusieurs mesures pour plus de stabilité
   float totalDistance = 0;
   int validReadings = 0;
   
   for (int i = 0; i < 3; i++) {  // Réduit à 3 lectures pour plus de rapidité
     float distance = getDistance();
     if (distance > 0 && distance <= emptyBinDistance * 1.5) {
       totalDistance += distance;
       validReadings++;
     }
     delay(50);  // Délai plus court entre les mesures
   }
   
   // Retourner -1 si aucune mesure valide
   if (validReadings == 0) {
     Serial.println("Aucune mesure de distance valide");
     return 0;
   }
   
   // Calculer la distance moyenne
   float avgDistance = totalDistance / validReadings;
   
   // Calculer le pourcentage de remplissage
   float emptySpace = (avgDistance / emptyBinDistance) * 100.0;
   float fillPercentage = 100.0 - emptySpace;
   
   // Limiter à un intervalle valide
   fillPercentage = constrain(fillPercentage, 0.0, 100.0);
   
   return fillPercentage;
 }
 
 float getDistance() {
   // Réinitialiser le pin de déclenchement
   digitalWrite(trigPin, LOW);
   delayMicroseconds(2);
   
   // Déclencher une impulsion ultrasonique
   digitalWrite(trigPin, HIGH);
   delayMicroseconds(10);
   digitalWrite(trigPin, LOW);
   
   // Lire le pin d'écho (durée en microsecondes)
   long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout
   
   // Calculer la distance en centimètres
   float distance = (duration * 0.034) / 2.0;
   
   return distance;
 }
 
 void sendDataToServer() {
   HTTPClient http;
   
   // Préparer l'URL pour la mise à jour de la poubelle
   String url = String(serverUrl) + "/" + String(binId);
   http.begin(url);
   http.addHeader("Content-Type", "application/json");
   
   // Créer le payload JSON
   StaticJsonDocument<200> jsonDoc;
   jsonDoc["fillLevel"] = fillLevel;
   
   // Sérialiser le JSON en chaîne
   String jsonPayload;
   serializeJson(jsonDoc, jsonPayload);
   
   // Envoyer la requête PUT
   int httpCode = http.PUT(jsonPayload);
   
   if (httpCode > 0) {
     Serial.print("Code HTTP: ");
     Serial.print(httpCode);
     String payload = http.getString();
     Serial.print(" | Réponse: ");
     Serial.println(payload);
   } else {
     Serial.print("Erreur HTTP: ");
     Serial.println(http.errorToString(httpCode));
   }
   
   http.end();
 }