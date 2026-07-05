import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import mammoth from 'mammoth';
import crypto from 'crypto';

dotenv.config();

// Initialize Prisma only when DATABASE_URL is provided
let prisma: any = undefined;
try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient();
  } else {
    console.warn('DATABASE_URL not set — Prisma will not be initialized. Filesystem fallback endpoints are available.');
  }
} catch (e) {
  console.warn('Prisma initialization failed, continuing without DB:', String(e));
  prisma = undefined;
}
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'chambre69_secret_key_luxury';

app.use(cors());
app.use(express.json());

// Servir les images statiques depuis la racine du dépôt
const ROOT_PATH = path.join(__dirname, '../../..');
app.use('/images', express.static(ROOT_PATH));

// --- Filesystem helper endpoint (fallback when DB is not configured) ---
function isImage(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
}

async function findFirstDocxRecursively(dir: string): Promise<string | undefined> {
  if (!fs.existsSync(dir)) return undefined;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (ext === '.docx' && !item.name.startsWith('~$')) return path.join(dir, item.name);
    }
  }
  for (const item of items) {
    if (item.isDirectory()) {
      const found = await findFirstDocxRecursively(path.join(dir, item.name));
      if (found) return found;
    }
  }
  return undefined;
}

async function extractDocxText(docxPath: string): Promise<string | undefined> {
  try {
    const result = await mammoth.extractRawText({ path: docxPath });
    return result.value.trim().replace(/\s+/g, ' ') || undefined;
  } catch (err) {
    return undefined;
  }
}

const EXCLUDED_FOLDERS = ['.git', 'project_room69', 'node_modules', 'backend', '.gemini', 'artifacts', '.vscode'];

function cryptoRandom(len = 6) {
  return crypto.randomBytes(Math.max(1, Math.ceil(len/2))).toString('hex').substring(0, len);
}

function cleanToSingleSentence(text: string, defaultName: string): string {
  if (!text) return `Découvrez notre collection raffinée de ${defaultName}.`;
  
  // Normalize newlines and spaces
  const textNormalized = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Split on sentences (dot, exclamation or question followed by space or end of string)
  const sentences = textNormalized.split(/(?<=[.!?])\s+/);
  
  for (let s of sentences) {
    s = s.trim();
    // Clean up prefix labels
    s = s.replace(/^(description|descriptif|caractéristiques|composition|soin|entretien|fiche technique)\s*:?\s*/i, '');
    s = s.replace(/^[-•*\s]+/, '').trim();
    
    // Ignore details / lists
    const lower = s.toLowerCase();
    if (lower.length < 25) continue;
    if (lower.startsWith('code produit') || lower.startsWith('référence') || lower.startsWith('ref:') || lower.startsWith('principal :') || lower.startsWith('matière :') || lower.startsWith('composition :')) continue;
    if (lower.startsWith('lavage') || lower.startsWith('pas de') || lower.startsWith('ne pas') || lower.startsWith('100%')) continue;
    if (s.includes(':') && s.split(':')[0].length < 15) continue;
    
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!['.', '!', '?'].includes(s.charAt(s.length - 1))) {
      s += '.';
    }
    return s;
  }
  
  return `Découvrez notre collection raffinée de ${defaultName}.`;
}

app.get('/api/shop-data-fs', async (req, res) => {
  try {
    const rootItems = fs.readdirSync(ROOT_PATH, { withFileTypes: true });
    const brands: any[] = [];
    for (const item of rootItems) {
      if (!item.isDirectory()) continue;
      if (item.name.startsWith('.') || EXCLUDED_FOLDERS.includes(item.name.trim())) continue;
      const brandName = item.name.trim();
      const brandPath = path.join(ROOT_PATH, item.name);
      const brandDoc = await findFirstDocxRecursively(brandPath);
      const brandDescriptionRaw = brandDoc ? await extractDocxText(brandDoc) : undefined;
      const brandDescription = cleanToSingleSentence(brandDescriptionRaw || '', brandName);

      const products: any[] = [];
      const walk = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walk(full);
          else if (e.isFile() && isImage(e.name)) {
            const rel = path.relative(ROOT_PATH, full).split(path.sep).map(encodeURIComponent).join('/');
            products.push({
              id: `p-${cryptoRandom(6)}`,
              name: path.basename(e.name, path.extname(e.name)),
              slug: `p-${cryptoRandom(6)}`,
              description: undefined,
              care_instructions: undefined,
              image_url: `http://localhost:${PORT}/images/${rel}`,
              variants: [{ id: `v-${cryptoRandom(6)}`, color: 'Standard', sizes: ['S','M','L'], product_id: '' }]
            });
          }
        }
      };
      walk(brandPath);

      const brandObj = {
        id: brandName,
        name: brandName,
        description: brandDescription,
        image_url: products.length > 0 ? products[0].image_url : undefined,
        products
      };
      brands.push(brandObj);
    }
    res.json({ brands });
  } catch (error) {
    console.error('Error building shop-data-fs:', error);
    res.status(500).json({ error: 'Failed to build shop data from filesystem' });
  }
});

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
