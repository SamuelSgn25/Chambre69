import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import shopData from '../data/shop-data.json';

interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  care_instructions: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  sizes: string[];
  created_at: string;
}

interface Brand {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
}

// Derive brands from local shop-data.json to ensure images and descriptions match repository data
const brands: Brand[] = (shopData.brands || []).map((b: any) => {
  const desc = (b.description || '').replace(/\d+%?/g, '').replace(/\s+/g, ' ').trim();
  const short = desc.split(/[\.\!\?]/)[0] || `Découvrez notre collection de ${b.name}`;
  return {
    id: b.id,
    name: b.name,
    shortDescription: short,
    fullDescription: desc,
    imageUrl: b.image_url || ''
  };
});

interface NavigationData {
  slug?: string;
  brand?: string;
  categorySlug?: string;
  search?: string;
}

interface HomePageProps {
  onNavigate: (page: string, data?: NavigationData) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<(Product & { variant: ProductVariant })[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    type ApiProduct = Product & { variants?: ProductVariant[] } & Record<string, unknown>;
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/products?featured=true`);
        const data = (await response.json()) as ApiProduct[];
        setFeaturedProducts(data.map((p) => ({
          ...p,
          variant: p.variants?.[0] || { id: 'default', product_id: p.id, color: 'Standard', sizes: ['S', 'M', 'L'], created_at: new Date().toISOString() }
        })));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    fetchFeatured();
  }, []);

  // Refs pour les carrousels
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const brandScrollRef = useRef<HTMLDivElement>(null);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Afficher Ysabel Mora en premier et conserver les autres
  const displayBrands = brands
    .slice()
    .sort((a, b) => (a.name === 'Ysabel Mora' ? -1 : b.name === 'Ysabel Mora' ? 1 : a.name.localeCompare(b.name)));

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    addToCart(product, variant, variant.sizes[0]);
  };

  const updateActiveIndex = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    const items = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  };

  const updateBrandActiveIndex = () => {
    if (!brandScrollRef.current) return;
    const container = brandScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    const items = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    setActiveBrandIndex(closestIndex);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateActiveIndex);
      updateActiveIndex();
      return () => container.removeEventListener('scroll', updateActiveIndex);
    }
  }, [featuredProducts]);

  useEffect(() => {
    const container = brandScrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateBrandActiveIndex);
      updateBrandActiveIndex();
      return () => container.removeEventListener('scroll', updateBrandActiveIndex);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FadeInOnLoad>
        <section className="relative min-h-[calc(100vh-6rem)] lg:min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 pt-32 lg:pt-8">
          <div className="w-full lg:w-1/2 h-[45vh] sm:h-[55vh] lg:h-auto rounded-3xl shadow-2xl overflow-hidden relative group">
            <img
              src={`${import.meta.env.BASE_URL}Hero_Image.png`}
              alt="Lingerie élégante"
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent lg:hidden" />
          </div>
          <div className="w-full lg:w-1/2 bg-black border border-[#C9A96E]/30 lg:border-2 lg:border-[#C9A96E] rounded-3xl shadow-2xl flex items-center justify-center p-6 sm:p-10 lg:p-12 transition-all duration-500 hover:border-[#C9A96E]">
            <div className="text-center max-w-lg mx-auto breathe">
              <span className="text-[10px] font-black text-[#C9A96E] uppercase tracking-[0.5em] mb-4 block">Maison de Lingerie</span>
              <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-7xl tracking-tight text-[#C9A96E] mb-6 leading-tight">
                Découvrez l'univers de<br />Chambre69
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#C9A96E]/80 mb-8 font-light leading-relaxed">
                Découvrez notre collection de lingerie haut de gamme, conçue pour sublimer votre beauté naturelle
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#C9A96E] text-black px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm tracking-widest rounded-full shadow-lg hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-105 font-bold uppercase"
              >
                Découvrir la collection
              </button>
            </div>
          </div>
        </section>
      </FadeInOnLoad>

      {/* Produits Vedettes */}
      <RevealOnScroll delay={0.1}>
        <section className="py-20 px-4 bg-[#F9F5F6]">
          <div className="max-w-7xl mx-auto -mt-14">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gray-300"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Produits Vedettes</h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 px-4"
              style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
            >
              {featuredProducts.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={item.id}
                    className={`flex-shrink-0 transition-all duration-500 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-70'}`}
                    style={{ width: '260px' }}
                  >
                    <div
                      className="relative bg-gray-100 overflow-hidden rounded-lg group cursor-pointer"
                      style={{ height: '300px' }}
                      onClick={() => onNavigate('product', { slug: item.slug })}
                    >
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className={`text-base font-medium mb-2 transition-colors ${isActive ? 'text-[#C9A96E]' : 'text-gray-900 group-hover:text-[#C9A96E]'}`}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">Couleur: {item.variant?.color}</p>
                      <p className="text-xs text-gray-600 mb-3">Tailles: {item.variant?.sizes.join(', ')}</p>
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => onNavigate('product', { slug: item.slug })} className="bg-black text-white px-3 py-1.5 text-xs hover:bg-[#C9A96E] transition-colors rounded">
                          Voir produit
                        </button>
                        <button onClick={() => handleAddToCart(item, item.variant)} className="border border-black text-black px-3 py-1.5 text-xs hover:bg-black hover:text-white transition-colors rounded">
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Section Sensuelle */}
      <RevealOnScroll delay={0.15}>
        <section className="py-16 px-4 bg-black border-2 border-[#C9A96E] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 mx-4 md:mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 p-6 md:p-8">
              <div className="flex flex-row gap-4 justify-center items-stretch">
                <div className="flex-1 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <img src="https://image.made-in-china.com/202f0j00ApFkgamEEcob/Ensemble-De-Lingerie-Deux-Pieces-Sexy-Pour-Femme.webp" alt="Pièce sensuelle 1" className="w-full h-64 object-cover" />
                </div>
                <div className="flex-1 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <img src="https://cdn.shopify.com/s/files/1/0870/4150/7665/files/BLOG_1.png?v=1763115011" alt="Pièce sensuelle 2" className="w-full h-64 object-cover" />
                </div>
                <div className="flex-1 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <img src="https://iris-lingerie.com/cdn/shop/files/fanny_ok2-min.jpg?v=1742942692" alt="Pièce sensuelle 3" className="w-full h-64 object-cover" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#C9A96E]">
                Osez révéler votre côté<br />
                <span className="text-[#C9A96E] font-semibold">le plus irrésistible</span>
              </h2>
              <p className="text-[#C9A96E]/80 mb-6 text-base md:text-lg">
                Découvrez notre collection de pièces sensuelles et sophistiquées
              </p>
              <button
                onClick={() => onNavigate('shop', { categorySlug: 'pieces-sensuelles' })}
                className="bg-[#C9A96E] text-black px-8 py-3 rounded-full text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Découvrir
              </button>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Marques d'exception */}
      <RevealOnScroll delay={0.2}>
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gray-300"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Nos marques d'exception</h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div
              ref={brandScrollRef}
              className="flex overflow-x-auto gap-6 pb-8 px-4"
              style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
            >
              {displayBrands.map((brand, idx) => {
                const isActive = idx === activeBrandIndex;
                const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const goToBrand = () => onNavigate('shop', { brand: slug });
                return (
                  <div
                    key={brand.id}
                    className={`flex-shrink-0 transition-all duration-500 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-70'}`}
                    style={{ width: '260px' }}
                  >
                    <div className="relative bg-gray-100 overflow-hidden rounded-lg group cursor-pointer" onClick={goToBrand}>
                      <img src={brand.imageUrl} alt={brand.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 text-center">
                      <h3
                        className={`text-base font-medium mb-2 transition-colors ${isActive ? 'text-[#C9A96E]' : 'text-gray-900 group-hover:text-[#C9A96E]'}`}
                        onClick={goToBrand}
                      >
                        {brand.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">{brand.shortDescription}</p>
                      <button onClick={goToBrand} className="bg-black text-white px-4 py-1.5 text-xs rounded-full hover:bg-[#C9A96E] transition-colors">
                        {brand.name === 'Ysabel Mora' ? 'découvrir la gamme' : 'Découvrir la marque'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Avis clientes */}
      <RevealOnScroll delay={0.1}>
        <section className="py-20 px-4 mt-10 bg-black border-2 border-[#C9A96E] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 mx-4 md:mx-auto max-w-6xl">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#C9A96E]">Avis de nos clientes</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-1/3 space-y-6">
                <div className="bg-black/50 border border-[#C9A96E]/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-3"><span className="text-[#C9A96E] text-xl">★★★★★</span></div>
                  <p className="text-gray-200 mb-3 text-sm italic">"Qualité exceptionnelle et confort inégalé. Je recommande vivement!"</p>
                  <p className="text-xs text-[#C9A96E]/70 font-medium">- Sophie M.</p>
                </div>
                <div className="bg-black/50 border border-[#C9A96E]/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-3"><span className="text-[#C9A96E] text-xl">★★★★★</span></div>
                  <p className="text-gray-200 mb-3 text-sm italic">"Des pièces élégantes qui subliment vraiment. Service client au top!"</p>
                  <p className="text-xs text-[#C9A96E]/70 font-medium">- Marie L.</p>
                </div>
                <div className="bg-black/50 border border-[#C9A96E]/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-3"><span className="text-[#C9A96E] text-xl">★★★★★</span></div>
                  <p className="text-gray-200 mb-3 text-sm italic">"Je me sens tellement confiante et féminine. Merci Chambre 69!"</p>
                  <p className="text-xs text-[#C9A96E]/70 font-medium">- Léa B.</p>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl border-4 border-[#C9A96E]">
                  <img src="https://img.ltwebstatic.com/v4/j/pi/2026/01/19/5e/1768800169e65566b1055f08e2b5c65fcd64694e4a_thumbnail_405x552.webp" alt="Cliente satisfaite" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="w-full md:w-1/3 space-y-6">
                <div className="bg-black/50 border border-[#C9A96E]/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-3"><span className="text-[#C9A96E] text-xl">★★★★★</span></div>
                  <p className="text-gray-200 mb-3 text-sm italic">"La lingerie est magnifique, les coupes sont parfaites. Je suis conquise!"</p>
                  <p className="text-xs text-[#C9A96E]/70 font-medium">- Camille D.</p>
                </div>
                <div className="bg-black/50 border border-[#C9A96E]/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-3"><span className="text-[#C9A96E] text-xl">★★★★★</span></div>
                  <p className="text-gray-200 mb-3 text-sm italic">"Service rapide et produit de qualité. Je recommande les yeux fermés."</p>
                  <p className="text-xs text-[#C9A96E]/70 font-medium">- Élodie R.</p>
                </div>
                <div className="bg-black/50 border border-[#C9A96E]/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-3"><span className="text-[#C9A96E] text-xl">★★★★★</span></div>
                  <p className="text-gray-200 mb-3 text-sm italic">"Je me sens sublime dans mes nouvelles pièces. Merci pour cette belle expérience!"</p>
                  <p className="text-xs text-[#C9A96E]/70 font-medium">- Julie T.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* WhatsApp */}
      <RevealOnScroll delay={0.15}>
        <section className="mt-16 md:mt-20 py-12 px-4 bg-black border-2 border-[#C9A96E] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 mx-4 md:mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <img src="https://asset.promod.com/product/208021-gz-1755513146.jpg?auto=webp&quality=80&crop=10:15" alt="Service client WhatsApp" className="w-full h-auto rounded-xl object-cover shadow-lg" />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E] mb-4">
                <MessageCircle className="h-8 w-8 text-[#C9A96E]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#C9A96E]">Commandez facilement via WhatsApp</h2>
              <p className="text-[#C9A96E]/80 mb-6 text-base md:text-lg">Un service personnalisé et rapide pour toutes vos commandes</p>
              <button
                onClick={() => window.open('https://wa.me/221787040505?text=Bonjour,%20je%20souhaite%20passer%20une%20commande', '_blank')}
                className="group relative bg-[#25D366] text-white px-8 py-3 text-sm tracking-wide rounded-full shadow-lg hover:bg-[#20BD5A] transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 overflow-hidden"
              >
                <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Commander maintenant</span>
                <span className="absolute inset-0 rounded-full border-2 border-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </button>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Modale Marque */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBrand(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button onClick={() => setSelectedBrand(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-10 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center">×</button>
              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                <div className="rounded-lg overflow-hidden"><img src={selectedBrand.imageUrl} alt={selectedBrand.name} className="w-full h-auto object-cover" /></div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{selectedBrand.name}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{selectedBrand.fullDescription}</p>
                  {selectedBrand.features && (
                    <>
                      <h4 className="font-semibold text-[#C9A96E] mb-2">Points forts :</h4>
                      <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-1">
                        {selectedBrand.features.map((feature, i) => <li key={i}>{feature}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              {selectedBrand.productImages && selectedBrand.productImages.length > 0 && (
                <div className="border-t border-gray-200 p-6 md:p-8">
                  <h4 className="font-semibold text-lg mb-4 text-gray-900">Quelques pièces emblématiques</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedBrand.productImages.map((img, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg overflow-hidden"><img src={img} alt={`Produit ${i+1}`} className="w-full h-48 object-cover" /></div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-6 md:p-8 pt-0 text-center">
                <button onClick={() => onNavigate('shop', { brand: selectedBrand.name.toLowerCase() })} className="bg-[#C9A96E] text-white px-6 py-2 rounded-full hover:bg-black transition-colors">
                  Voir toute la collection {selectedBrand.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};