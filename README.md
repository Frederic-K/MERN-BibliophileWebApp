# MERN-BibliophileWebApp
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
# 📚 MERN-Bibliophile Client

## 🧩 Overview

The **MERN-Bibliophile Client** is the frontend interface of the MERN-Bibliophile application. Built with **React**, **Vite.js**, **Tailwind CSS**, and **DaisyUI**, it provides a fast, responsive, and elegant user experience for managing bookshelves, wishlists, and user profiles.

Designed to complement the backend, this frontend offers intuitive access to all features of a book-lover’s personal library.

---

## 🚀 Features

- 🔐 **User Authentication**
  Secure login and registration with JWT support.

- 📚 **Bookshelf Management**
  View and organize your books by reading status, rating, and custom shelves.

- 🎯 **Wishlist Creation**
  Build and share your book wishlists with others.

- 📖 **Book & Author Details**
  Browse detailed information about books and their authors.

- 🌐 **Internationalization**
  Dynamic language switching and route translation support.

- 🛡️ **Protected Routes**
  Access control using custom private and management route components.

- 💥 **Error Handling**
  Custom error pages for unauthorized access and not found routes.

- 💅 **Responsive UI**
  Fully responsive layout using Tailwind CSS and DaisyUI components.

---

## 🛠️ Getting Started

### ✅ Prerequisites

Ensure the following are installed:

- Node.js (v16 or higher)
- npm (or yarn)

---

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/MERN-DaisyUI-Bibliophile-client.git
   cd MERN-DaisyUI-Bibliophile-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   To build the project for production:

   ```bash
   npm run build
   ```

---

## 🧱 Project Structure

```plaintext
📁 src/
├── components/       → Shared UI elements (e.g. Navbar, Button, Layout)
├── pages/            → Application views (Dashboard, Library, BookDetails, etc.)
├── routes/           → Custom routing components (PrivateRoute, AdminRoute)
├── lib/store/        → Zustand global state management
├── providers/        → Context providers (e.g., AuthProvider, LocaleProvider)
├── styles/           → Tailwind/DaisyUI styles and custom theming
├── App.jsx           → Application entry point and route definitions
├── main.jsx          → Vite + React bootstrap file
```

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For questions, suggestions, or feedback, contact:
**Frédéric KREUDER**
📧 [frederic-k@fkonnect.com](mailto:frederic-k@fkonnect.com)

---

# 📚 Client MERN-Bibliophile

## 🧩 Aperçu

Le **Client MERN-Bibliophile** est l’interface utilisateur de l’application MERN-Bibliophile. Construit avec **React**, **Vite.js**, **Tailwind CSS** et **DaisyUI**, il offre une expérience fluide, rapide et responsive pour gérer ses bibliothèques personnelles, listes de souhaits et profils utilisateurs.

Pensée pour compléter le backend, cette interface permet un accès intuitif à toutes les fonctionnalités essentielles pour les passionnés de lecture.

---

## 🚀 Fonctionnalités

- 🔐 **Authentification Utilisateur**
  Connexion et inscription sécurisées avec support JWT.

- 📚 **Gestion de Bibliothèque**
  Visualisez et organisez vos livres selon leur statut de lecture, leur note et leur étagère.

- 🎯 **Création de Liste de Souhaits**
  Créez et partagez vos listes de souhaits avec d’autres utilisateurs.

- 📖 **Fiches Livres & Auteurs**
  Parcourez les informations détaillées sur les livres et leurs auteurs.

- 🌐 **Internationalisation**
  Prise en charge du multilingue et des routes dynamiques traduites.

- 🛡️ **Routes Protégées**
  Contrôle d’accès via des composants de route personnalisés (privés / admin).

- 💥 **Gestion des Erreurs**
  Pages d’erreur personnalisées pour les accès refusés et les routes introuvables.

- 💅 **Interface Responsive**
  Interface entièrement responsive avec Tailwind CSS et DaisyUI.

---

## 🛠️ Mise en Route

### ✅ Prérequis

Assurez-vous d’avoir installé :

- Node.js (v16 ou plus)
- npm (ou yarn)

---

### 📦 Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/your-username/MERN-DaisyUI-Bibliophile-client.git
   cd MERN-DaisyUI-Bibliophile-client
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d’environnement**

   Créez un fichier `.env` à la racine du projet :

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

   Pour construire l'application en mode production :

   ```bash
   npm run build
   ```

---

## 🧱 Structure du Projet

```plaintext
📁 src/
├── components/       → Composants réutilisables (Navbar, Layout, etc.)
├── pages/            → Pages de l’application (Dashboard, Bibliothèque, Détails)
├── routes/           → Routes privées ou conditionnelles personnalisées
├── lib/store/        → Gestion d’état global avec Zustand
├── providers/        → Context providers (authentification, langue, etc.)
├── styles/           → Fichiers de styles Tailwind/DaisyUI
├── App.jsx           → Point d’entrée de l’application et définition des routes
├── main.jsx          → Fichier d’amorçage React + Vite
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

