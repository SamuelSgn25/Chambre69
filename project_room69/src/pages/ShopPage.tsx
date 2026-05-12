import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { API_URL } from '../config';

interface Product {
  id: string;
  category_id: string;
  brand_id?: string;
  subcategory?: string;
  collection?: string;
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
}

export const ShopPage = ({ onNavigate }: ShopPageProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string>>({});
  const [selectedCollections, setSelectedCollections] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeProductIndexes, setActiveProductIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/shop-data`);
        const data = await response.json();
        // Filter out any accidentally scanned system folders
        const cleanBrands = data.brands.filter((b: Brand) => 
          !['backend', 'project_room69', 'node_modules', 'project'].includes(b.name.toLowerCase())
        );
        setBrands(cleanBrands);
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

  const updateActiveIndex = (key: string, container: HTMLDivElement) => {
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
    setActiveProductIndexes(prev => ({ ...prev, [key]: closestIndex }));
  };

  useEffect(() => {
    const refs = scrollContainerRefs.current;
    Object.entries(refs).forEach(([key, ref]) => {
      if (ref) {
        const handler = () => updateActiveIndex(key, ref);
        ref.addEventListener('scroll', handler);
        handler();
        return () => ref.removeEventListener('scroll', handler);
      }
    });
  }, [brands, selectedSubcategories, selectedCollections]);

  const scrollToBrand = (brandId: string) => {
    const section = brandSectionRefs.current[brandId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-serif text-gray-400 animate-pulse italic">Ouverture de la Chambre...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-white pt-36 pb-20 px-4 text-gray-900 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal - Style Pure White & Gold */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-8xl font-bold font-serif text-gray-900 mb-8 tracking-tighter leading-none">
              BIENVENUE DANS <br/>
              <span className="text-[#C9A96E] italic">LA CHAMBRE</span>
            </h1>
            <div className="w-24 h-px bg-[#C9A96E] mx-auto mb-8"></div>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto italic tracking-wide">
              "Découvrez notre collection complète de lingerie haut de gamme, servez-vous."
            </p>
          </div>

          {/* Grille des Marques - Design Épuré */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => scrollToBrand(brand.id)}
                  className="group cursor-pointer flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-100 group-hover:border-[#C9A96E] group-hover:scale-110 transition-all duration-700 shadow-sm">
                    <img
                      src={brand.image_url || 'https://via.placeholder.com/150'}
                      alt={brand.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <h3 className="text-[10px] font-black text-gray-400 text-center uppercase tracking-[0.3em] group-hover:text-black transition-colors">
                    {brand.name}
                  </h3>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Sections par Marque */}
          {brands.map((brand) => {
            const subcategories = Array.from(new Set(brand.products.map(p => p.subcategory).filter(Boolean))) as string[];
            const selectedSub = selectedSubcategories[brand.id] || (subcategories.length > 0 ? subcategories[0] : null);
            
            const filteredBySub = selectedSub 
              ? brand.products.filter(p => p.subcategory === selectedSub)
              : brand.products;

            const collections = Array.from(new Set(filteredBySub.map(p => p.collection).filter(Boolean))) as string[];
            const selectedCol = selectedCollections[`${brand.id}-${selectedSub}`] || (collections.length > 0 ? collections[0] : null);

            const finalProducts = selectedCol
              ? filteredBySub.filter(p => p.collection === selectedCol)
              : filteredBySub;

            const scrollKey = `${brand.id}-${selectedSub}-${selectedCol}`;
            const activeIndex = activeProductIndexes[scrollKey] || 0;

            return (
              <RevealOnScroll key={brand.id} delay={0.15}>
                <div
                  ref={(el) => { brandSectionRefs.current[brand.id] = el; }}
                  className="mb-48 scroll-mt-24"
                >
                  {/* Header de Marque */}
                  <div className="text-center mb-16 px-4">
                    <p className="text-[10px] font-bold text-[#C9A96E] uppercase tracking-[0.5em] mb-4">MAISON</p>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-12 tracking-tight">
                      {brand.name}
                    </h2>
                    
                    {/* Sélecteur de Sous-catégories */}
                    {subcategories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-6 mb-12 border-y border-gray-50 py-6">
                        {subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              setSelectedSubcategories(prev => ({ ...prev, [brand.id]: sub }));
                              // Reset collection when subcategory changes
                              setSelectedCollections(prev => {
                                const newCols = { ...prev };
                                delete newCols[`${brand.id}-${sub}`];
                                return newCols;
                              });
                            }}
                            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative pb-2 ${
                              selectedSub === sub
                                ? 'text-black'
                                : 'text-gray-300 hover:text-gray-900'
                            }`}
                          >
                            {sub}
                            {selectedSub === sub && (
                              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C9A96E]"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sélecteur de Collections (Dropdown style for many collections) */}
                    {collections.length > 1 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {collections.map((col) => (
                          <button
                            key={col}
                            onClick={() => setSelectedCollections(prev => ({ ...prev, [`${brand.id}-${selectedSub}`]: col }))}
                            className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                              selectedCol === col
                                ? 'bg-[#C9A96E] text-white shadow-lg'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Affichage des Produits */}
                  {finalProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/30 rounded-3xl border border-gray-100">
                      <p className="text-gray-300 italic font-serif">Aucun article disponible pour cette sélection.</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        ref={(el) => { scrollContainerRefs.current[scrollKey] = el; }}
                        className="flex overflow-x-auto gap-12 pb-16 px-4 hide-scrollbar"
                        style={{ scrollSnapType: 'x mandatory' }}
                      >
                        {finalProducts.map((item, idx) => {
                          const isActive = idx === activeIndex;
                          const variant = item.variants[0];
                          return (
                            <div
                              key={item.id}
                              className={`flex-shrink-0 transition-all duration-1000 ease-in-out scroll-snap-align-center ${
                                isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-20'
                              }`}
                              style={{ width: '320px' }}
                            >
                              <div
                                className="relative bg-white overflow-hidden rounded-[2rem] group cursor-pointer shadow-2xl"
                                style={{ height: '480px' }}
                                onClick={() => onNavigate('product', { slug: item.slug })}
                              >
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/500?text=Indisponible')}
                                />
                                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                                  <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 rounded-full shadow-2xl">
                                    Découvrir
                                  </span>
                                </div>
                              </div>
                              <div className={`mt-10 text-center transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <h5 className="text-2xl font-serif font-bold text-gray-900 mb-2">{item.name}</h5>
                                <p className="text-[9px] text-[#C9A96E] font-black uppercase tracking-[0.4em] mb-6">{selectedCol || 'Collection Exclusive'}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(item, variant); }}
                                  className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-[#C9A96E] transition-all shadow-xl"
                                >
                                  Ajouter au Panier
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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