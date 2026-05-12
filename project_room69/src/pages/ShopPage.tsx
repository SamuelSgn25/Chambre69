import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { API_URL } from '../config';

interface Product {
  id: string;
  category_id: string;
  brand_id?: string;
  subcategory?: string;
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
  description: string;
  image_url: string;
  products: (Product & { variants: ProductVariant[] })[];
}

interface ShopPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategorySlug?: string;
}

const brandConfig = [
  { name: 'Curvy Kate', subcategories: ['Slip', 'Soutien'] },
  { name: 'Dita Von Teese', subcategories: ['Culotte', 'Porte jarelle', 'Slip', 'Soutien gorge'] },
  { name: 'Elomi', subcategories: ['Slip', 'Soutien gorge'] },
  { name: 'Empreinte', subcategories: ['Cullotes', 'Soutien gorge'] },
  { name: 'Fantasie', subcategories: [] },
  { name: 'Freya', subcategories: [] },
  { name: 'Louisa bracq', subcategories: ['Slip', 'Soutien gorge'] },
  { name: 'Wacoal', subcategories: ['Slip', 'Soutien'] },
  { name: 'Ysabel Mora', subcategories: [] },
  { name: 'Quelques accessoires', subcategories: [] },
  { name: 'Senteurs', subcategories: [] },
  { name: 'Tenues Spéciales', subcategories: [] }
];

export const ShopPage = ({ onNavigate }: ShopPageProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeProductIndexes, setActiveProductIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/shop-data`);
        const data = await response.json();
        setBrands(data.brands);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    const defaultVariant = variant || {
      id: 'default',
      product_id: product.id,
      color: 'Standard',
      sizes: ['S', 'M', 'L'],
      created_at: new Date().toISOString()
    } as ProductVariant;
    addToCart(product, defaultVariant, defaultVariant.sizes[0]);
  };

  const updateActiveIndex = (brandId: string, container: HTMLDivElement) => {
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
    setActiveProductIndexes(prev => ({ ...prev, [brandId]: closestIndex }));
  };

  useEffect(() => {
    const refs = scrollContainerRefs.current;
    Object.entries(refs).forEach(([brandId, ref]) => {
      if (ref) {
        const handler = () => updateActiveIndex(brandId, ref);
        ref.addEventListener('scroll', handler);
        handler();
        return () => ref.removeEventListener('scroll', handler);
      }
    });
  }, [brands, selectedSubcategories]);

  const scrollToBrand = (brandId: string) => {
    const section = brandSectionRefs.current[brandId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5F6] flex items-center justify-center">
        <div className="text-2xl font-semibold text-[#C9A96E] animate-pulse">Chargement de la boutique...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#F9F5F6] pt-36 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 breathe mb-4">
              Bienvenu dans la chambre, belle femme
            </h1>
            <p className="text-center text-gray-600 text-lg md:text-xl font-light">
              Découvrez notre collection complète de lingerie haut de gamme, servez vous.
            </p>
          </div>

          {/* Grille des Marques (blocs cliquables) */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-24 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                {brands.slice(0, 5).map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => scrollToBrand(brand.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105 flex items-center p-4 gap-4 h-24"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 flex-shrink-0 border border-[#C9A96E]/30">
                      <img
                        src={brand.image_url || 'https://via.placeholder.com/64?text=Brand'}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#C9A96E] leading-tight group-hover:text-white transition-colors">
                      {brand.name}
                    </h3>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                {brands.slice(5, 9).map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => scrollToBrand(brand.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105 flex items-center p-4 gap-4 h-24"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 flex-shrink-0 border border-[#C9A96E]/30">
                      <img
                        src={brand.image_url || 'https://via.placeholder.com/64?text=Brand'}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#C9A96E] leading-tight group-hover:text-white transition-colors">
                      {brand.name}
                    </h3>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mt-6">
                {brands.slice(9).map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => scrollToBrand(brand.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105 flex items-center p-4 gap-4 h-24"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 flex-shrink-0 border border-[#C9A96E]/30">
                      <img
                        src={brand.image_url || 'https://via.placeholder.com/64?text=Image'}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#C9A96E] leading-tight group-hover:text-white transition-colors">
                      {brand.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Sections par Marque */}
          {brands.map((brand) => {
            const config = brandConfig.find(c => c.name.toLowerCase() === brand.name.toLowerCase());
            const subcategories = config?.subcategories || [];
            const selectedSub = selectedSubcategories[brand.id] || (subcategories.length > 0 ? subcategories[0] : null);
            
            const filteredProducts = selectedSub 
              ? brand.products.filter(p => p.subcategory?.toLowerCase() === selectedSub.toLowerCase())
              : brand.products;

            const activeIndex = activeProductIndexes[brand.id] || 0;

            return (
              <RevealOnScroll key={brand.id} delay={0.15}>
                <div
                  ref={(el) => { brandSectionRefs.current[brand.id] = el; }}
                  className="mb-32 scroll-mt-24"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                      {brand.name}
                    </h2>
                    
                    {/* Boutons de sous-catégories */}
                    {subcategories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubcategories(prev => ({ ...prev, [brand.id]: sub }))}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              selectedSub === sub
                                ? 'bg-black text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#C9A96E] hover:text-[#C9A96E]'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 border border-dashed border-[#C9A96E]/30 rounded-2xl">
                      <p className="text-gray-500 text-lg">Aucun produit disponible dans cette section pour le moment.</p>
                    </div>
                  ) : (
                    <div
                      ref={(el) => { scrollContainerRefs.current[brand.id] = el; }}
                      className="flex overflow-x-auto gap-8 pb-12 px-4 hide-scrollbar"
                      style={{ scrollSnapType: 'x mandatory' }}
                    >
                      {filteredProducts.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        const variant = item.variants[0];
                        return (
                          <div
                            key={item.id}
                            className={`flex-shrink-0 transition-all duration-700 ease-out scroll-snap-align-center ${
                              isActive ? 'scale-105 z-10' : 'scale-95 opacity-60'
                            }`}
                            style={{ width: '320px' }}
                          >
                            <div
                              className="relative bg-white overflow-hidden rounded-2xl group cursor-pointer shadow-xl border border-[#C9A96E]/10"
                              style={{ height: '450px' }}
                              onClick={() => onNavigate('product', { slug: item.slug })}
                            >
                              <img
                                src={item.image_url || 'https://via.placeholder.com/450'}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <p className="text-white text-sm font-light italic">{brand.name}</p>
                              </div>
                            </div>
                            <div className="p-6 text-center">
                              <h3 className={`text-xl font-bold mb-3 transition-colors ${isActive ? 'text-[#C9A96E]' : 'text-gray-900'}`}>
                                {item.name}
                              </h3>
                              <div className="space-y-1 mb-6">
                                <p className="text-sm text-gray-500">Couleur: <span className="font-medium text-gray-900">{variant?.color || 'Standard'}</span></p>
                                <p className="text-sm text-gray-500">Tailles: <span className="font-medium text-gray-900">{variant?.sizes.join(', ') || 'Unique'}</span></p>
                              </div>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={() => onNavigate('product', { slug: item.slug })}
                                  className="bg-black text-white px-6 py-2.5 text-sm hover:bg-[#C9A96E] transition-all duration-300 rounded-full font-medium shadow-md"
                                >
                                  Détails
                                </button>
                                <button
                                  onClick={() => handleAddToCart(item, variant)}
                                  className="border-2 border-black text-black px-6 py-2.5 text-sm hover:bg-black hover:text-white transition-all duration-300 rounded-full font-medium"
                                >
                                  Panier
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </FadeInOnLoad>
  );
};