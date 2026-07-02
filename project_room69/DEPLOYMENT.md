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

Exemple :
```env
DATABASE_URL="postgresql://user:password@ep-example-12345.us-east-1.aws.neon.tech:5432/neondb?sslmode=require"
```

---

## 3. Préparer le backend

1. Ouvrez le dossier `project_room69/backend`.
2. Installez les dépendances :
```bash
npm install
```
3. Assurez-vous que le fichier `backend/package.json` contient :
   - `express`, `cors`, `dotenv`, `@prisma/client`, `mammoth`
4. Vérifiez que le fichier `backend/prisma/schema.prisma` utilise `env("DATABASE_URL")`.

### Initialiser la base de données Prisma

1. Créez la migration locale :
```bash
npx prisma migrate dev --name init
```
2. Générer le client Prisma :
```bash
npx prisma generate
```
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
