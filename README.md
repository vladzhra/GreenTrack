# GreenTrack

GreenTrack est une solution innovante pour optimiser la gestion des déchets urbains grâce à des technologies basées sur l'Intelligence Artificielle (IA) et l'Internet des Objets (IoT). Ce projet vise à réduire les coûts, améliorer l'efficacité de la collecte des déchets, et promouvoir un environnement plus propre.

## Fonctionnalités

- **Surveillance en temps réel** : Des capteurs installés sur les poubelles permettent de suivre le niveau de remplissage en temps réel.
- **Optimisation des itinéraires** : Génération d'itinéraires efficaces pour réduire la consommation de carburant et le temps de collecte.
- **Carte interactive** : Affiche les poubelles pleines et vides sur une carte pour une gestion facile.
- **Notifications** : Alertes automatiques pour éviter le débordement des poubelles.
- **Interface utilisateur intuitive** : Une application mobile avec une navigation simple et des données exploitables.

## Technologies utilisées

- **Frontend** : React Native
- **Backend** : Node.js avec Express
- **Base de données** : PostgreSQL
- **Matériel** : Capteurs de distance HC-SR04, ESP32, batteries rechargeables
- **Carte** : Bibliothèque `react-native-maps`

## Installation et configuration

### Prérequis

- Node.js installé sur votre machine
- Expo CLI (si vous utilisez Expo) : `npm install -g expo-cli`
- PostgreSQL pour la base de données

### Installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/votre-repo/greentrack.git
   cd greentrack
   ```

2. Installez les dépendances du projet :

   ```bash
   npm install
   ```

3. Lancez l'application mobile :

   ```bash
   npx expo start --tunnel
   ```

4. Scanner le QR code avec l'application Expo Go sur votre téléphone.

## Utilisation

1. Ouvrez l'application mobile pour voir les poubelles sur la carte.
2. Cliquez sur "Calculate Itinerary" pour générer l'itinéraire optimal.
3. Recevez des notifications lorsque les poubelles approchent de leur capacité maximale.

## Contribution

1. Fork ce dépôt.
2. Créez une branche pour votre fonctionnalité : `git checkout -b feature/your-feature-name`
3. Commitez vos modifications : `git commit -m 'Add some feature'`
4. Poussez vos modifications : `git push origin feature/your-feature-name`
5. Ouvrez une Pull Request.

## Équipe

- **Thomas Fiancette** - Hardware Manager
- **Fred Tossou** - Hardware
- **Mardochée Zossoungbo** - Backend
- **Vlad Zaharia** - Leader Frontend
- **Lucas Palazuelo** - Frontend
- **Vincent Ballandi** - Leader Backend
- **Mathias Ballot** - Hardware
