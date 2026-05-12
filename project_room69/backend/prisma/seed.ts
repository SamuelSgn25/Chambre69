import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean DB
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  // Create a default category
  const defaultCategory = await prisma.category.create({
    data: {
      name: 'Lingerie',
      slug: 'lingerie',
      description: 'Toute la lingerie'
    }
  });

  const brands = [
    { name: 'Curvy Kate', image_url: 'http://localhost:5000/images/curvy kate/brand.jpg' },
    { name: 'Dita Von Teese', image_url: 'http://localhost:5000/images/Dita von teese/brand.jpg' },
    { name: 'Elomi', image_url: 'http://localhost:5000/images/Elomi/brand.jpg' },
    { name: 'Empreinte', image_url: 'http://localhost:5000/images/Empreinte/brand.jpg' },
    { name: 'Fantasie', image_url: 'http://localhost:5000/images/Fantasie/brand.jpg' },
    { name: 'Freya', image_url: 'http://localhost:5000/images/Freya/brand.jpg' },
    { name: 'Louisa bracq', image_url: 'http://localhost:5000/images/Louisa bracq/brand.jpg' },
    { name: 'Wacoal', image_url: 'http://localhost:5000/images/Wacoal/brand.jpg' },
    { name: 'Ysabel Mora', image_url: 'http://localhost:5000/images/Ysabel Mora/brand.jpg' },
    { name: 'Quelques accessoires', image_url: 'http://localhost:5000/images/accessoires.jpg' },
    { name: 'Senteurs', image_url: 'http://localhost:5000/images/senteurs.jpg' },
    { name: 'Tenues Spéciales', image_url: 'http://localhost:5000/images/tenues_speciales.jpg' }
  ];

  const createdBrands = [];
  for (const b of brands) {
    const brand = await prisma.brand.create({
      data: {
        name: b.name,
        image_url: b.image_url,
        description: `Collection haut de gamme de ${b.name}`
      }
    });
    createdBrands.push(brand);
  }

  // Sample Products for brands with subcategories
  const sampleProducts = [
    {
      name: 'Soutien-gorge Taegan',
      slug: 'soutien-gorge-taegan',
      brand_id: createdBrands.find(b => b.name === 'Elomi')?.id,
      subcategory: 'Soutien gorge',
      image_url: 'http://localhost:5000/images/Elomi/soutien gorge/Soutien gorge collection taegan/TEAGAN_RAINBOW_UW-PADDED-HALF-CUP-BRA_EL302615_CUTOUT_WEB_SS26.jpg',
      variants: [{ color: 'Rainbow', sizes: ['90D', '95E'] }]
    },
    {
      name: 'Slip Taegan',
      slug: 'slip-taegan',
      brand_id: createdBrands.find(b => b.name === 'Elomi')?.id,
      subcategory: 'Slip',
      image_url: 'http://localhost:5000/images/Elomi/slips/slip1.jpg',
      variants: [{ color: 'Rainbow', sizes: ['M', 'L'] }]
    },
    {
      name: 'Soutien-gorge Victory',
      slug: 'soutien-gorge-victory',
      brand_id: createdBrands.find(b => b.name === 'Curvy Kate')?.id,
      subcategory: 'Soutien',
      image_url: 'http://localhost:5000/images/curvy kate/soutien1.jpg',
      variants: [{ color: 'Noir', sizes: ['90E', '95F'] }]
    },
    {
      name: 'Slip Victory',
      slug: 'slip-victory',
      brand_id: createdBrands.find(b => b.name === 'Curvy Kate')?.id,
      subcategory: 'Slip',
      image_url: 'http://localhost:5000/images/curvy kate/slip1.jpg',
      variants: [{ color: 'Noir', sizes: ['S', 'M', 'L'] }]
    }
  ];

  for (const p of sampleProducts) {
    if (p.brand_id) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          brand_id: p.brand_id,
          subcategory: p.subcategory,
          category_id: defaultCategory.id,
          image_url: p.image_url,
          variants: {
            create: p.variants
          }
        }
      });
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
