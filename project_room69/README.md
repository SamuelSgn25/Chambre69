# Chambre 69 - Boutique de Lingerie Haut de Gamme

Bienvenue dans le projet **Chambre 69**, une boutique en ligne élégante et moderne dédiée à la lingerie de luxe.

## 🚀 Technologies Utilisées

### Frontend
- **React** (avec TypeScript)
- **Vite**
- **Tailwind CSS** (pour le style)
- **Lucide React** (pour les icônes)
- **Framer Motion** (pour les animations fluides)

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL** (Base de données)
- **Prisma** (ORM)

## 📁 Structure du Projet

```
project_room69/
├── backend/                # Serveur Node.js & Configuration Base de données
│   ├── prisma/             # Schéma et migrations Prisma
│   ├── src/                # Code source du backend (Express)
│   └── .env                # Variables d'environnement (DB URL, Port)
├── src/                    # Code source du frontend (React)
│   ├── components/         # Composants UI réutilisables
│   ├── context/            # Gestion de l'état (Panier)
│   ├── pages/              # Pages principales (Shop, Home, etc.)
│   └── config.ts           # Configuration du frontend (API URL)
├── public/                 # Assets statiques
└── package.json            # Dépendances frontend
```

## 🛠️ Installation et Configuration

### 1. Prérequis
- Node.js (v18+)
- PostgreSQL installé et en cours d'exécution

### 2. Configuration du Backend
1. Allez dans le dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Configurez votre base de données dans le fichier `.env` :
   ```env
   DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/votre_base_de_donnees?schema=public"
   ```
4. Générez le client Prisma : `npm run prisma:generate`
5. Appliquez les migrations : `npm run prisma:migrate`
6. (Optionnel) Peuplez la base de données avec des données de test : `npm run prisma:seed`
7. Lancez le serveur : `npm run dev`

### 3. Configuration du Frontend
1. Revenez à la racine : `cd ..`
2. Installez les dépendances : `npm install`
3. Lancez l'application : `npm run dev`

## 🔄 Peuplement Dynamique de la Base de Données

Le script de "seed" (`backend/prisma/seed.ts`) a été conçu pour parcourir automatiquement les dossiers d'images à la racine du dépôt :
- **Marques concernées** : Curvy Kate, Dita Von Teese, Elomi, Empreinte, Fantaisie, Freya, Louisa Bracq, Wacoal, Ysabel Mora.
- **Fonctionnement** : Il scanne chaque dossier et sous-dossier (ex: "Soutien-gorge", "Slips") et crée automatiquement un produit en base de données pour chaque image trouvée.
- **Mise à jour** : Pour rafraîchir la liste des produits après avoir ajouté des images, relancez simplement `npm run prisma:seed` dans le dossier `backend`.

## 🤖 CI/CD (GitHub Actions)

Un workflow GitHub Actions est configuré dans `.github/workflows/main.yml` pour :
- Vérifier la validité du build (Frontend & Backend) à chaque push.
- S'assurer que le client Prisma est correctement généré.

## ✨ Fonctionnalités
- **Navigation fluide** : SPA avec transitions animées.
- **Boutique complète** : Affichage par marques avec filtrage par sous-catégories.
- **Scan automatique** : Toutes les images déposées dans les dossiers racines sont automatiquement intégrées à la boutique via le script de seed.
- **Panier dynamique** : Ajout/suppression d'articles en temps réel.
- **Backend robuste** : API REST avec TypeScript, PostgreSQL et Prisma.

---
Développé avec ❤️ pour Chambre 69.
