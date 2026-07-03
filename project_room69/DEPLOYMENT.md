# Déploiement du projet Chambre 69

Ce guide décrit la procédure complète pour déployer le projet avec :
- **Neon** pour la base de données PostgreSQL
- **Render** pour le backend Node.js + Prisma
- **Vercel** pour le frontend React + Vite

---

## 1. Préparation du dépôt

1. Assurez-vous que le dépôt **project_room69** est à jour.
2. Les dossiers à la racine contiennent les images et les fichiers Word pour chaque collection.
3. Le backend utilise Prisma et lit les images relatives à l’arborescence racine.

---

## 2. Créer la base de données sur Neon

1. Connectez-vous sur https://neon.tech.
2. Créez un nouveau projet.
3. Notez l’URL de connexion PostgreSQL fournie par Neon.
4. Dans la zone `Connection strings`, copiez la valeur `postgresql://...`

### Variables d’environnement Neon
- `DATABASE_URL`: URL de connexion PostgreSQL Neon

---

## 5. Déployer sur Vercel (frontend + backend)

Le dépôt a maintenant un dossier `backend` à la racine et `project_room69` contient uniquement le frontend. Deux approches possibles :

Option A — Projets Vercel séparés (recommandé, simple)
- Créez un projet Vercel pour le frontend en pointant le `Root Directory` sur `project_room69`.
  - Build Command: `npm install && npm run build`
  - Output Directory: `dist`
  - Définissez `VITE_API_URL` comme l'URL publique de votre backend (ex. Render, autre Vercel).

- Créez un projet Vercel distinct pour le backend en pointant le `Root Directory` sur `backend`.
  - Build Command: `npm install && npm run build`
  - Start / Runtime: configurez pour Node (ou laissez Vercel détecter une API Serverless selon votre code).
  - Variables d'environnement : `DATABASE_URL`, `JWT_SECRET`, etc.

- Option B — Monorepo (un seul projet Vercel avec `vercel.json` au repo root)
- Le fichier `vercel.json` est placé à la racine du dépôt et décrit les deux services `frontend` et `backend`.
- Configuration active :
  - service `frontend` : root `project_room69`, framework `vite`
  - service `backend` : root `backend`, framework `node`
  - rewrite : `/api/*` → `backend`

- Avantages : Vercel gère les deux services et proxy `/api` vers le backend automatiquement.

Variables d’environnement Vercel communes
- `DATABASE_URL` : URL PostgreSQL (Neon)
- `JWT_SECRET` : clé JWT
- `VITE_API_URL` : URL publique de l'API (si frontend et backend sont sur des projets séparés)

Exemples :
```env
# si backend sur Render ou projet séparé
VITE_API_URL="https://backend-chambre69.onrender.com/api"

# si monorepo et proxy Vercel (Option B), vous pouvez laisser VITE_API_URL="/api"
VITE_API_URL="/api"
```

Notes
- Si vous choisissez l'Option B (monorepo), assurez-vous que `vercel.json` est lisible depuis la racine du dépôt et que Vercel a accès à `backend` (ne déployez pas uniquement le sous-dossier `project_room69`).
- Si vous gardez l'Option A (projets séparés), mettez à jour `VITE_API_URL` dans les variables d'environnement Vercel du projet frontend.

### Réimporter le dépôt à la racine sur Vercel (monorepo)

Si vous avez importé `project_room69` comme `Root Directory`, Vercel refusera toute configuration qui tente d'accéder au parent (ex. `../backend`). Pour déployer correctement en monorepo depuis la racine :

1. Nouveau projet (import depuis GitHub)
  - Allez sur Vercel → `New Project` → `Import Git Repository` → sélectionnez `Chambre69`.
  - Dans la configuration du projet, laissez `Root Directory` vide (racine `/`). Ne sélectionnez pas `project_room69`.
  - Vérifiez que `/vercel.json` existe à la racine du repo (il doit décrire `frontend` et `backend`).
  - Définissez les variables d'environnement (`DATABASE_URL`, `JWT_SECRET`, etc.).
  - Déployez.

2. Projet existant (changer Root Directory)
  - Ouvrez le projet sur Vercel → `Settings` → `General` → `Root Directory` : changez-le pour la racine (`/`). Si la modification est bloquée, supprimez le projet et réimportez en sélectionnant la racine.

3. Commandes Vercel CLI utiles (exécutez-les depuis la racine du repo)

```bash
# Se connecter
vercel login

# Déployer en production depuis la racine
vercel --prod

# Ajouter une variable d'environnement en production
vercel env add DATABASE_URL production

# Lister les variables d'environnement
vercel env ls
```

Remarque : après import à la racine, Vercel lit `/vercel.json` (sans `..`) et crée les services `frontend` et `backend`. La réécriture `/api/*` sera appliquée côté Vercel vers le service `backend`.

3. Exécuter le seed pour importer les produits depuis le dossier racine :
```bash
npm run prisma:seed
```

> Le seed lit les fichiers image et les fichiers `.docx` de chaque dossier de collection. Il extrait automatiquement la description si un fichier Word est trouvé dans le même dossier que l’image.

---

## 4. Déployer le backend sur Render

### Créer un service backend
1. Connectez-vous à https://render.com.
2. Créez un nouveau service **Web Service**.
3. Sélectionnez le dépôt GitHub contenant `project_room69`.
4. Branche : `main`.
5. Build Command :
```bash
cd backend && npm install && npm run build
```
6. Start Command :
```bash
cd backend && npm start
```
7. Environnement : `Node 18` ou plus.

### Variables d’environnement sur Render
- `DATABASE_URL` : URL PostgreSQL Neon
- `JWT_SECRET` : clé secrète pour JWT (ex : `chambre69_secret_key_luxury`)

### Ajustement du seed sur Render
- `backend/prisma/seed.ts` se base sur le dossier racine `ROOT_PATH`.
- En production Render, l’arborescence projet doit inclure le dossier des images.
- Vérifiez que les ressources sont disponibles dans le repo.

---

## 5. Déployer le frontend sur Vercel

1. Connectez-vous à https://vercel.com.
2. Ajoutez un nouveau projet depuis GitHub.
3. Sélectionnez le dépôt `project_room69`.
4. Build Command :
```bash
npm install && npm run build
```
5. Output Directory :
```bash
dist
```

### Variables d’environnement Vercel
- `VITE_API_URL` : URL du backend Render

Exemple :
```env
VITE_API_URL="https://backend-chambre69.onrender.com/api"
```

> Si votre backend Render expose le service à `https://backend-chambre69.onrender.com`, ajoutez `/api` à la fin dans `VITE_API_URL`.

---

## 6. Configuration finale

### Backend
- Vérifier `backend/src/index.ts` :
  - `process.env.PORT` pour le port Render
  - `process.env.JWT_SECRET`
  - `process.env.DATABASE_URL`

### Frontend
- Vérifier `src/config.ts` :
  - `VITE_API_URL` est utilisé pour les appels API.

### Exemple de `.env` local
```env
# backend/.env
DATABASE_URL="postgresql://user:password@neon.example:5432/dbname?sslmode=require"
JWT_SECRET="votre_cle_jwt"
```

```env
# frontend/.env
VITE_API_URL="http://localhost:5000/api"
```

---

## 7. Test de bout en bout

1. Lancer le backend local :
```bash
cd backend
npm run dev
```
2. Lancer le frontend local :
```bash
npm run dev
```
3. Vérifier :
   - `http://localhost:5173` en local
   - Authentification fonctionnelle
   - Panier bloqué si non connecté
   - Requêtes API via `VITE_API_URL`
   - Produits et descriptions extraites des `.docx`

---

## 8. Notes importantes

- La commande panier est désormais protégée : l’utilisateur doit se connecter pour utiliser WhatsApp via le panier.
- Les descriptions des collections sont extraites des fichiers Word présents dans les dossiers de produits.
- Le seul fichier YAML du projet est `.github/workflows/main.yml` et le `docker-compose.yml` local pour PostgreSQL.

---

## 9. Commandes utiles

```bash
# Rebuild backend et frontend
npm install
npm run build
cd backend
npm run build

# Regénérer Prisma
npx prisma generate
npm run prisma:seed
```
