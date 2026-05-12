import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ROOT_PATH = path.join(__dirname, '../../..');
const BRANDS_FOLDERS = [
  'curvy kate', 'Dita von teese', 'Elomi', 'Empreinte', 
  'Fantasie', 'Freya', 'Louisa bracq', 'Wacoal', 'Ysabel Mora'
];

async function main() {
  console.log('Starting dynamic seeding with collections support...');
  
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  const defaultCategory = await prisma.category.create({
    data: { name: 'Lingerie', slug: 'lingerie', description: 'Toute la lingerie' }
  });

  for (const brandName of BRANDS_FOLDERS) {
    console.log(`Processing brand: ${brandName}`);
    const brand = await prisma.brand.create({
      data: {
        name: brandName,
        image_url: `http://localhost:5000/images/${brandName}/brand.jpg`,
        description: `Collection haut de gamme de ${brandName}`
      }
    });

    const brandPath = path.join(ROOT_PATH, brandName);
    if (!fs.existsSync(brandPath)) continue;

    const subdirs = fs.readdirSync(brandPath, { withFileTypes: true });
    for (const subdir of subdirs) {
      if (subdir.isDirectory()) {
        const subcategoryName = subdir.name;
        const subcategoryPath = path.join(brandPath, subcategoryName);
        
        // Scan for collections within subcategory
        const items = fs.readdirSync(subcategoryPath, { withFileTypes: true });
        for (const item of items) {
          if (item.isDirectory()) {
            const collectionName = item.name;
            const collectionPath = path.join(subcategoryPath, collectionName);
            
            const images = scanImages(collectionPath);
            for (const img of images) {
              await createProduct(img, brand.id, defaultCategory.id, subcategoryName, collectionName);
            }
          } else if (item.isFile() && isImage(item.name)) {
            await createProduct(path.join(subcategoryPath, item.name), brand.id, defaultCategory.id, subcategoryName);
          }
        }
      } else if (subdir.isFile() && isImage(subdir.name)) {
        await createProduct(path.join(brandPath, subdir.name), brand.id, defaultCategory.id);
      }
    }
  }

  // Handle Special Sections
  const specialSections = ['Quelques accessoires', 'Senteurs', 'Tenues Spéciales'];
  for (const sectionName of specialSections) {
    const brand = await prisma.brand.create({
      data: { name: sectionName, description: `Collection ${sectionName}` }
    });
    
    const sectionPath = path.join(ROOT_PATH, sectionName);
    if (fs.existsSync(sectionPath)) {
      const images = scanImages(sectionPath);
      for (const img of images) {
        await createProduct(img, brand.id, defaultCategory.id);
      }
    }
  }

  console.log('Seed completed successfully');
}

async function createProduct(filePath: string, brandId: string, categoryId: string, subcategory?: string, collection?: string) {
  const relativePath = path.relative(ROOT_PATH, filePath).replace(/\\/g, '/');
  const fileName = path.basename(filePath, path.extname(filePath));
  const hash = crypto.createHash('md5').update(relativePath).digest('hex').substring(0, 6);
  
  // Clean up collection name if it contains keywords
  let cleanedCollection = collection;
  if (collection && collection.toLowerCase().includes('collection')) {
    cleanedCollection = collection.replace(/collection/i, '').trim();
    // Capitalize first letter
    cleanedCollection = cleanedCollection.charAt(0).toUpperCase() + cleanedCollection.slice(1);
  }

  const slug = `${path.basename(path.dirname(path.dirname(filePath))).toLowerCase()}-${subcategory?.toLowerCase() || 'default'}-${collection?.toLowerCase() || 'none'}-${fileName.toLowerCase()}-${hash}`.replace(/\s+/g, '-');

  try {
    await prisma.product.create({
      data: {
        name: fileName,
        slug: slug,
        brand_id: brandId,
        subcategory: subcategory,
        collection: cleanedCollection,
        category_id: categoryId,
        image_url: `http://localhost:5000/images/${relativePath}`,
        variants: {
          create: [{ color: 'Standard', sizes: ['S', 'M', 'L'] }]
        }
      }
    });
  } catch (e) {
    // console.error(`Error creating product for ${relativePath}:`, e);
  }
}

function scanImages(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanImages(filePath));
    } else if (isImage(file)) {
      results.push(filePath);
    }
  });
  return results;
}

function isImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
