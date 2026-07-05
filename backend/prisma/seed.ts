import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mammoth from 'mammoth';

const prisma = new PrismaClient();
const descriptionCache = new Map<string, string | undefined>();

const ROOT_PATH = path.join(__dirname, '../../..');

// Explicitly exclude these folders
const EXCLUDED_FOLDERS = ['.git', 'project_room69', 'node_modules', 'backend', '.gemini', 'artifacts', '.vscode'];

async function main() {
  console.log('--- STARTING DYNAMIC SEEDING ---');
  
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  const defaultCategory = await prisma.category.create({
    data: { name: 'Lingerie', slug: 'lingerie', description: 'Toute la lingerie' }
  });

  const rootItems = fs.readdirSync(ROOT_PATH, { withFileTypes: true });
  
  for (const item of rootItems) {
    if (item.isDirectory() && !item.name.startsWith('.') && !EXCLUDED_FOLDERS.includes(item.name.trim())) {
      const brandName = item.name.trim();
      console.log(`> Found brand folder: "${item.name}" (Display Name: "${brandName}")`);
      
      const brand = await prisma.brand.create({
        data: {
          name: brandName,
          description: `Maison ${brandName}`
        }
      });

      const brandPath = path.join(ROOT_PATH, item.name);
      await scanAndCreateProducts(brandPath, brand.id, defaultCategory.id);

      // Representative Image for the Brand Bubble
      const brandDescriptionFile = await findFirstDocxRecursively(brandPath);
      const brandDescriptionRaw = brandDescriptionFile ? await extractDocxText(brandDescriptionFile) : undefined;
      const brandDescription = cleanToSingleSentence(brandDescriptionRaw || '', brandName);
      await prisma.brand.update({
        where: { id: brand.id },
        data: { description: brandDescription }
      });

      const firstProduct = await prisma.product.findFirst({
        where: { brand_id: brand.id },
        select: { image_url: true }
      });
      
      if (firstProduct) {
        console.log(`  [OK] Set representative image for ${brandName}`);
        await prisma.brand.update({
          where: { id: brand.id },
          data: { image_url: firstProduct.image_url }
        });
      } else {
        console.warn(`  [WARN] No images found for ${brandName}`);
      }
    }
  }

  console.log('--- SEEDING COMPLETED ---');
}

async function scanAndCreateProducts(dir: string, brandId: string, categoryId: string, subcategory?: string, collection?: string) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      if (!subcategory) {
        await scanAndCreateProducts(fullPath, brandId, categoryId, item.name, collection);
      } else {
        const newCollection = collection ? `${collection} - ${item.name}` : item.name;
        await scanAndCreateProducts(fullPath, brandId, categoryId, subcategory, newCollection);
      }
    } else if (item.isFile() && isImage(item.name)) {
      await createProduct(fullPath, brandId, categoryId, subcategory, collection);
    }
  }
}

async function findNearestDescriptionFile(directory: string): Promise<string | undefined> {
  if (!fs.existsSync(directory)) return undefined;
  const items = fs.readdirSync(directory, { withFileTypes: true });
  const docxFile = items.find((item) => item.isFile() && isDescriptionFile(item.name));
  if (docxFile) {
    return path.join(directory, docxFile.name);
  }

  const parentDirectory = path.dirname(directory);
  if (parentDirectory !== directory && parentDirectory.startsWith(ROOT_PATH)) {
    return findNearestDescriptionFile(parentDirectory);
  }

  return undefined;
}

async function findFirstDocxRecursively(dir: string): Promise<string | undefined> {
  if (!fs.existsSync(dir)) return undefined;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isFile() && isDescriptionFile(item.name)) {
      return path.join(dir, item.name);
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

async function createProduct(filePath: string, brandId: string, categoryId: string, subcategory?: string, collection?: string) {
  const relativePath = path.relative(ROOT_PATH, filePath).replace(/\\/g, '/');
  const fileName = path.basename(filePath, path.extname(filePath));
  const hash = crypto.createHash('md5').update(relativePath).digest('hex').substring(0, 6);

  const productDir = path.dirname(filePath);
  let descriptionText = descriptionCache.get(productDir);
  if (descriptionText === undefined) {
    const docxPath = await findNearestDescriptionFile(productDir);
    descriptionText = docxPath ? await extractDocxText(docxPath) : undefined;
    descriptionCache.set(productDir, descriptionText);
  }
  
  const cleanSub = subcategory ? subcategory.trim() : undefined;
  let cleanCol = collection ? collection.trim() : undefined;
  
  if (cleanCol) {
    cleanCol = cleanCol.replace(/collection/gi, '').trim();
    cleanCol = cleanCol.replace(/-+/g, '-').replace(/^-|-$/g, '').trim();
    if (cleanCol) {
      cleanCol = cleanCol.charAt(0).toUpperCase() + cleanCol.slice(1);
    } else {
      cleanCol = undefined;
    }
  }

  // Generate a strictly unique slug
  const slug = `p-${hash}`;

  // Ensure the URL is correctly encoded for the frontend
  const encodedPath = relativePath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const imageUrl = `http://localhost:5000/images/${encodedPath}`;

  try {
    await prisma.product.create({
      data: {
        name: fileName,
        slug: slug,
        brand_id: brandId,
        subcategory: cleanSub,
        collection: cleanCol || 'Général',
        category_id: categoryId,
        description: cleanToSingleSentence(descriptionText || '', fileName),
        image_url: imageUrl,
        variants: {
          create: [{ color: 'Standard', sizes: ['S', 'M', 'L'] }]
        }
      }
    });
  } catch (e) {
    // console.error(`Failed to create ${fileName}:`, e);
  }
}

async function extractDocxText(docxPath: string): Promise<string | undefined> {
  try {
    const result = await mammoth.extractRawText({ path: docxPath });
    return result.value.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim() || undefined;
  } catch (error) {
    console.warn(`  [WARN] Impossible de parser ${docxPath}:`, error);
    return undefined;
  }
}

function isDescriptionFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ext === '.docx' && !filename.startsWith('~$');
}

function findDescriptionFile(directory: string): string | undefined {
  const files = fs.readdirSync(directory);
  const docxFile = files.find((name) => {
    const ext = path.extname(name).toLowerCase();
    return ext === '.docx' && !name.startsWith('~$');
  });
  return docxFile ? path.join(directory, docxFile) : undefined;
}

function isImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
