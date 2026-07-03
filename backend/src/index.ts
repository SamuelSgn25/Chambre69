import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'chambre69_secret_key_luxury';

app.use(cors());
app.use(express.json());

// Servir les images statiques depuis la racine du dépôt
const ROOT_PATH = path.join(__dirname, '../../..');
app.use('/images', express.static(ROOT_PATH));

// --- ROUTES AUTHENTIFICATION ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Mot de passe incorrect.' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// --- ROUTES BOUTIQUE ---

app.get('/api/shop-data', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        products: {
          include: { variants: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ brands });
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Failed to fetch shop data' });
  }
});

app.get('/api/products', async (req, res) => {
  const { featured } = req.query;
  try {
    const filter: any = {};
    if (featured === 'true') {
      filter.is_featured = true;
    }

    const products = await prisma.product.findMany({
      where: filter,
      include: { variants: true, brand: true, category: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { 
        variants: true,
        brand: true,
        category: true
      }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
