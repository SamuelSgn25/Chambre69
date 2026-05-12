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
  console.log('Starting dynamic seeding...');
  
  // Clean DB
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
        image_url: `http://localhost:5000/images/${brandName}/brand.jpg`, // Placeholder
        description: `Collection haut de gamme de ${brandName}`
      }
    });

    const brandPath = path.join(ROOT_PATH, brandName);
    if (!fs.existsSync(brandPath)) {
      console.warn(`Path not found: ${brandPath}`);
      continue;
    }

    // Scan subdirectories
    const subdirs = fs.readdirSync(brandPath, { withFileTypes: true });
    for (const subdir of subdirs) {
      if (subdir.isDirectory()) {
        const subcategoryName = subdir.name;
        const subdirPath = path.join(brandPath, subcategoryName);
        
        // Scan images in subcategory
        const files = scanImages(subdirPath);
        for (const file of files) {
          const relativePath = path.relative(ROOT_PATH, file).replace(/\\/g, '/');
          const fileName = path.basename(file, path.extname(file));
          
          // Use a hash of the relative path to ensure unique slugs
          const hash = crypto.createHash('md5').update(relativePath).digest('hex').substring(0, 6);
          const uniqueSlug = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${subcategoryName.toLowerCase().replace(/\s+/g, '-')}-${fileName.toLowerCase().replace(/\s+/g, '-')}-${hash}`;
          
          try {
            await prisma.product.create({
              data: {
                name: fileName,
                slug: uniqueSlug,
                brand_id: brand.id,
                subcategory: subcategoryName,
                category_id: defaultCategory.id,
                image_url: `http://localhost:5000/images/${relativePath}`,
                variants: {
                  create: [{ color: 'Standard', sizes: ['S', 'M', 'L'] }]
                }
              }
            });
          } catch (err) {
            console.error(`Failed to create product for ${relativePath}:`, err);
          }
        }
      } else if (subdir.isFile() && isImage(subdir.name)) {
        // Image directly in brand folder
        const relativePath = path.relative(ROOT_PATH, path.join(brandPath, subdir.name)).replace(/\\/g, '/');
        const fileName = path.basename(subdir.name, path.extname(subdir.name));
        const hash = crypto.createHash('md5').update(relativePath).digest('hex').substring(0, 6);
        const uniqueSlug = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${fileName.toLowerCase().replace(/\s+/g, '-')}-${hash}`;

        try {
          await prisma.product.create({
            data: {
              name: fileName,
              slug: uniqueSlug,
              brand_id: brand.id,
              category_id: defaultCategory.id,
              image_url: `http://localhost:5000/images/${relativePath}`,
              variants: {
                create: [{ color: 'Standard', sizes: ['S', 'M', 'L'] }]
              }
            }
          });
        } catch (err) {
          console.error(`Failed to create product for ${relativePath}:`, err);
        }
      }
    }
  }

  // Handle Special Sections
  const specialSections = ['Quelques accessoires', 'Senteurs', 'Tenues Spéciales'];
  for (const section of specialSections) {
    await prisma.brand.create({
      data: {
        name: section,
        description: `Collection ${section}`
      }
    });
  }

  console.log('Dynamic seed completed successfully');
}

function scanImages(dir: string): string[] {
  let results: string[] = [];
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
