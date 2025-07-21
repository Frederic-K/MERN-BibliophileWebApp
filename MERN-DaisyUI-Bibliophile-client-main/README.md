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
