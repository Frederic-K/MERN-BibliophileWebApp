# 📚 MERN-Bibliophile Server

## 🧩 Overview

The **MERN-Bibliophile Server** is the backend component of the MERN-Bibliophile application, built with **Node.js**, **Express.js**, **MongoDB**, and **JWT**. It is designed to manage books, personal bookshelves, and wishlists for users in a secure, scalable, and efficient way.

This server serves as a versatile foundation for any book-centric app requiring user authentication, content management, and shareable features.

---

## 🚀 Features

- 🔐 **User Authentication**
  Secure authentication with JSON Web Tokens (JWT).

- 📖 **Book Management**
  Create, update, and delete books with cover image support (stored on Firebase).

- 🗂️ **Bookshelf Management**
  Users can organize their personal bookshelves by reading status, ratings, and due dates for borrowed books.

- 🎯 **Wishlist Management**
  Build and manage wishlists with the ability to share them via email.

- 🖋️ **Author Information**
  Manage author data and link them to relevant books.

- ✅ **Data Validation**
  Request validation powered by Joi for maintaining data integrity.

- 🛡️ **Security Best Practices**
  Integrated Helmet, CORS, and rate limiting.

- 🔑 **Access Control**
  Fine-grained permissions using **CASL** (Code Access Security Language).

- 📝 **Logging**
  Centralized logging with Winston, including support for MongoDB log storage.

---

## 🛠️ Getting Started

### ✅ Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MongoDB
- A Firebase account (for file storage)

---

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/MERN-Bibliophile-server.git
   cd MERN-Bibliophile-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and define the required variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FIREBASE_CONFIG=your_firebase_config
   ```

4. **Start the server**

   - For production:

     ```bash
     npm start
     ```

   - For development (with auto-reload using nodemon):

     ```bash
     npm run dev
     ```

---

## 🧱 Project Structure

```plaintext
📁 config/         -> Firebase, mailer, and permission configs
📁 controllers/    -> Business logic for each feature
📁 models/         -> Mongoose models for MongoDB collections
📁 routes/         -> Express routes per domain (auth, books, etc.)
📁 middleware/     -> Custom middleware (auth, error handling, validation)
📁 utils/          -> Helper functions (logging, sorting, emails)
📁 validations/    -> Joi schemas for validating requests
```

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For any questions, suggestions, or feedback, feel free to reach out:
**Frédéric KREUDER**
📧 [frederic-k@fkonnect.com](mailto:frederic-k@fkonnect.com)

---

# 📚 Serveur MERN-Bibliophile

## 🧩 Aperçu

Le **Serveur MERN-Bibliophile** constitue le backend de l'application MERN-Bibliophile. Il est développé avec **Node.js**, **Express.js**, **MongoDB** et **JWT**. Ce serveur gère les livres, les bibliothèques personnelles et les listes de souhaits des utilisateurs, en offrant une base robuste, sécurisée et évolutive.

C’est une solution idéale pour toute application orientée livres nécessitant une authentification utilisateur, une gestion de contenu et des fonctionnalités de partage.

---

## 🚀 Fonctionnalités

- 🔐 **Authentification Utilisateur**
  Authentification sécurisée via JSON Web Tokens (JWT).

- 📖 **Gestion des Livres**
  Ajout, modification et suppression de livres, avec prise en charge des images de couverture stockées sur Firebase.

- 🗂️ **Gestion de Bibliothèque**
  Les utilisateurs peuvent organiser leurs bibliothèques selon leur statut de lecture, leurs évaluations, et les dates d’échéance des emprunts.

- 🎯 **Gestion de Liste de Souhaits**
  Création et gestion de listes de souhaits, partageables par e-mail.

- 🖋️ **Informations sur les Auteurs**
  Gestion des auteurs et association avec les livres correspondants.

- ✅ **Validation des Données**
  Validation des requêtes avec Joi pour garantir l'intégrité des données.

- 🛡️ **Sécurité**
  Mise en place des meilleures pratiques avec Helmet, CORS et limitation du taux de requêtes.

- 🔑 **Contrôle d’Accès**
  Permissions fines gérées via **CASL** (Code Access Security Language).

- 📝 **Journalisation**
  Logs complets avec Winston, avec stockage possible dans MongoDB.

---

## 🛠️ Mise en Route

### ✅ Prérequis

Assurez-vous d'avoir installé les éléments suivants :

- Node.js
- npm
- MongoDB
- Un compte Firebase (pour le stockage des fichiers)

---

### 📦 Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/your-username/MERN-Bibliophile-server.git
   cd MERN-Bibliophile-server
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d’environnement**

   Créez un fichier `.env` à la racine du projet et ajoutez-y les variables nécessaires :

   ```env
   MONGODB_URI=ton_uri_mongodb
   JWT_SECRET=ton_secret_jwt
   FIREBASE_CONFIG=ta_configuration_firebase
   ```

4. **Lancer le serveur**

   - En production :

     ```bash
     npm start
     ```

   - En développement (avec rechargement automatique via nodemon) :

     ```bash
     npm run dev
     ```

---

## 🧱 Structure du Projet

```plaintext
📁 config/         -> Configurations Firebase, mailer, permissions
📁 controllers/    -> Logique métier des fonctionnalités
📁 models/         -> Modèles Mongoose pour les collections MongoDB
📁 routes/         -> Routes Express (auth, livres, etc.)
📁 middleware/     -> Middlewares personnalisés (authentification, erreurs, validation)
📁 utils/          -> Fonctions utilitaires (logs, tri, emails)
📁 validations/    -> Schémas Joi pour la validation des requêtes
```

---

## 📄 Licence

Ce projet est sous licence **MIT**.
Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📬 Contact

Pour toute question, suggestion ou retour, contactez :
**Frédéric KREUDER**
📧 [frederic-k@fkonnect.com](mailto:frederic-k@fkonnect.com)

---
