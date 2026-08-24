# 🌹 Chambre 69 — Boutique de Lingerie de Luxe

**Chambre 69** est une boutique en ligne de lingerie et d'accessoires haut de gamme. Ce dépôt contient le code source du frontend React/Vite et les images sources du catalogue. Le backend a été retiré du dépôt — le site utilise désormais des données statiques (`shop-data.json`) servies par le frontend.

---

## 📁 Structure du projet

```
Chambre69/
├── project_room69/          # Frontend (React + Vite + TypeScript)
│   ├── public/
│   │   └── products/        # 📸 Images des produits (413+ fichiers)
│   └── src/
│       ├── pages/
│       │   └── ShopPage.tsx # Page principale de la boutique
│       ├── data/
│       │   └── shop-data.json   # Catalogue produits (données statiques)
│       └── components/      # Composants réutilisables
│
<!-- Backend removed from repository -->
│
├── Dita von teese/          # Images source — Marque Dita Von Teese
├── Elomi/                   # Images source — Marque Elomi
├── Empreinte/               # Images source — Marque Empreinte
├── Fantasie/                # Images source — Marque Fantasie
├── Freya/                   # Images source — Marque Freya
├── Jouets pour adultes/     # Images source — Catégorie Jouets
├── Kimonos/                 # Images source — Catégorie Kimonos
├── Krizalid/                # Images source — Marque Krizalid
├── Linga dore/              # Images source — Marque Linga Dorée
├── Lingerie Sexy/           # Images source — Catégorie Lingerie Sexy
├── Louisa bracq/            # Images source — Marque Louisa Bracq
├── Maternité et Grossesse/  # Images source — Catégorie Maternité
├── Miracle Suit/            # Images source — Marque Miracle Suit
├── Senteurs, Encens et Huiles/ # Images source — Catégorie Senteurs
├── Wacoal/                  # Images source — Marque Wacoal
├── Ysabel Mora/             # Images source — Marque Ysabel Mora
├── curvy kate/              # Images source — Marque Curvy Kate
├── Chaines de taille/       # Images source — Catégorie Chaînes
└── vercel.json              # Configuration de déploiement Vercel
```

---

## 🚀 Installation et lancement

### Prérequis

- **Node.js** v18+
- **npm** v9+
- **PostgreSQL** (pour le backend)

### Frontend

```bash
cd project_room69
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`.

### Backend

Le backend a été retiré du dépôt. Le frontend sert désormais un catalogue statique à partir de `project_room69/src/data/shop-data.json`.

---

## 🖼️ Gestion des Images

Toutes les images des produits se trouvent dans :
```
project_room69/public/products/
```

Les images sont référencées dans le fichier de données statiques :
```
project_room69/src/data/shop-data.json
```

### Règles importantes pour les images

1. **Format des URLs** : Les `image_url` dans `shop-data.json` doivent utiliser le format `/products/<nom_fichier>` (ex : `/products/abc123.jpeg`).
2. **Fichiers acceptés** : `.jpg`, `.JPG`, `.jpeg`, `.webp`, `.avif`, `.png`
3. **Taille minimale** : Tout fichier image inférieur à 500 octets est considéré corrompu/vide et ne s'affichera pas.
4. **Ajout de nouvelles images** : Copier le fichier dans `project_room69/public/products/`, puis relancer le script de génération de catalogue.

Pour régénérer automatiquement `shop-data.json` à partir des dossiers racine (respecte l'architecture présente à la racine du dépôt) :

```bash
python3 project_room69/scripts/process_data.py
```

### Vérification de l'intégrité des images

Pour vérifier que toutes les images référencées existent et sont valides :

```bash
python3 -c "
import json, os

with open('project_room69/src/data/shop-data.json') as f:
    data = json.load(f)

public_dir = 'project_room69/public'
issues = []

for brand in data['brands']:
    for p in brand.get('products', []):
        url = p.get('image_url', '')
        if url:
            path = public_dir + url
            if not os.path.exists(path):
                issues.append(f'MANQUANT: {url}')
            elif os.path.getsize(path) < 500:
                issues.append(f'VIDE/CORROMPU: {url}')

print(f'Problèmes détectés: {len(issues)}')
for i in issues: print(i)
"
```

---

## 🏷️ Marques disponibles

| Marque | Catégorie |
|--------|-----------|
| Ysabel Mora | Lingerie & Maillot |
| Curvy Kate | Lingerie Grande Taille |
| Elomi | Lingerie Grande Taille |
| Empreinte | Haute Couture Lingerie |
| Fantasie | Lingerie & Soutiens-gorge |
| Freya | Lingerie Active |
| Wacoal | Lingerie Confort |
| Krizalid | Lingerie Sexy |
| Louisa Bracq | Lingerie Française |
| Dita Von Teese | Lingerie de Scène |
| Linga Dorée | Lingerie Luxe |
| Miracle Suit | Maillots de bain |
| Lingerie Sexy | Lingerie & Accessoires |
| Kimonos | Déshabillés & Kimonos |
| Maternité & Grossesse | Lingerie Maternité |
| Jouets pour adultes | Accessoires Adultes |
| Senteurs, Encens et Huiles | Bien-être & Senteurs |
| Chaines de taille | Bijoux de Corps |

---

## 🌐 Déploiement

Le projet est configuré pour être déployé sur **Vercel**. Le déploiement sert uniquement le `frontend` (`project_room69`) et les API du backend ne sont plus présentes dans le dépôt. Le fichier `vercel.json` a été mis à jour pour supprimer le service backend.

---

## 🛠️ Technologies utilisées

### Frontend
- **React 18** + **TypeScript**
- **Vite** (bundler)
- **Tailwind CSS** (styles)
- **Lucide React** (icônes)
- **React Router** (navigation)

### Backend
- **NestJS** (framework)
- **Prisma** (ORM)
- **PostgreSQL** (base de données)
- **JWT** (authentification)

---

## 📞 Contact & Commandes

Les clients peuvent passer commande via **WhatsApp** directement depuis la page boutique.

**Numéro WhatsApp** : +221 78 704 05 05

---

*© 2026 Chambre 69 — Tous droits réservés*
