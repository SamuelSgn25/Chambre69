import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { API_URL } from '../config';
import { X, MessageCircle, Info, Ruler, Sparkles } from 'lucide-react';
import shopData from '../data/shop-data.json';

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

const ProductModal = ({ product, onClose, onAddToCart }: { product: Product & { variants: ProductVariant[] }, onClose: () => void, onAddToCart: (p: Product, v: ProductVariant) => void }) => {
  const variant = product.variants[0] || { color: 'Standard', sizes: ['S', 'M', 'L'] };
  
  const handleWhatsApp = () => {
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const message = encodeURIComponent(`Bonjour, je suis intéressé par ce produit :\n\n${productUrl}\n\nPouvez-vous me confirmer sa disponibilité ?`);
    window.open(`https://wa.me/221787040505?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] flex flex-col md:flex-row relative border border-[#C9A96E]/10">
        <button onClick={onClose} className="absolute top-8 right-8 z-20 bg-gray-900 text-white p-3 rounded-full hover:bg-[#C9A96E] transition-all shadow-xl hover:scale-110 active:scale-95">
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-full md:w-3/5 h-64 sm:h-80 md:h-auto overflow-hidden bg-[#FAFAFA] relative">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-6 sm:p-12 transition-transform duration-[3s] hover:scale-110" />
          <div className="absolute top-12 left-12">
            <span className="text-[10px] font-black text-[#C9A96E] uppercase tracking-[0.5em]">{product.collection || 'Exclusivité'}</span>
          </div>
        </div>
        
          <div className="w-full md:w-2/5 p-6 sm:p-12 md:p-16 overflow-y-auto bg-white flex flex-col">
          <div className="mb-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight tracking-tighter">{product.name}</h2>
            
            <div className="space-y-12 mb-12">
              <div className="group">
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A96E] mb-4">
                  <Info className="w-3 h-3" /> Histoire de la pièce
                </h4>
                <p className="text-gray-500 text-base leading-relaxed font-light italic">
                  {product.description || 'Une création unique alliant sensualité et savoir-faire artisanal.'}
                </p>
              </div>
              
              <div className="space-y-8">
                <div className="group">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                    <Ruler className="w-3 h-3" /> Guide des tailles
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {variant.sizes.map(s => (
                      <span key={s} className="min-w-[36px] sm:min-w-[40px] text-center text-[11px] font-bold text-gray-900 border border-gray-100 px-3 sm:px-4 py-2 rounded-xl bg-gray-50/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                    <Sparkles className="w-3 h-3" /> Détails & Soin
                  </h4>
                  <div className="bg-[#FDFDFD] p-6 rounded-2xl border border-gray-50 text-gray-400 text-xs leading-relaxed">
                    <p>{product.care_instructions || 'Lavage délicat recommandé.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => { onAddToCart(product, variant as ProductVariant); onClose(); }}
              className="w-full bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.3em] py-4 sm:py-6 rounded-2xl hover:bg-[#C9A96E] transition-all shadow-2xl"
            >
              Ajouter au Panier
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-white border border-gray-100 text-gray-900 text-[11px] font-black uppercase tracking-[0.3em] py-4 sm:py-6 rounded-2xl hover:border-[#25D366] hover:text-[#25D366] transition-all flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShopPage = ({}: ShopPageProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string>>({});
  const [selectedCollections, setSelectedCollections] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<(Product & { variants: ProductVariant[] }) | null>(null);
  const { addToCart } = useCart();

  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeProductIndexes, setActiveProductIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try primary API then filesystem fallback
        const candidates = [`${API_URL}/shop-data`, `${API_URL.replace(/:\d+/, ':5001')}/shop-data-fs`, `${API_URL}/shop-data-fs`];
        let data: any = null;
        
        for (const url of candidates) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            data = await res.json();
            if (data && data.brands && data.brands.length > 0) break;
          } catch (err) {
            continue;
          }
        }

        // Use local shopData if API fails or is empty
        if (!data || !data.brands || data.brands.length === 0) {
          console.log('Using local shop data fallback');
          data = shopData;
        }

        if (!data || !data.brands) {
          setBrands([]);
          return;
        }

        const cleanBrands = data.brands.filter((b: Brand) => 
          !['backend', 'project_room69', 'node_modules', 'project', '.git', '.vscode', 'scripts'].includes(b.name.toLowerCase())
        );
        setBrands(cleanBrands);
      } catch (error) {
        console.error('Error fetching shop data:', error);
        // Final fallback
        setBrands(shopData.brands as Brand[]);
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
        <div className="text-xl font-serif text-[#C9A96E] animate-pulse italic">Préparation de votre univers...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#FDFDFD] pt-48 pb-20 px-4 text-gray-900 font-sans">
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={handleAddToCart}
          />
        )}

        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-32 group">
            <p className="text-[10px] font-black text-[#C9A96E] uppercase tracking-[0.6em] mb-6 animate-in fade-in slide-in-from-bottom-2">Maison de Lingerie</p>
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-bold font-serif text-gray-900 mb-10 tracking-tighter leading-none transition-colors duration-1000 hover:text-[#C9A96E] cursor-default">
              CHAMBRE 69
            </h1>
            <div className="w-32 h-1 bg-black mx-auto mb-10 transition-all duration-700 group-hover:w-64 group-hover:bg-[#C9A96E] rounded-full"></div>
            <p className="text-gray-400 text-lg md:text-2xl font-light max-w-2xl mx-auto italic tracking-wide transition-colors duration-1000 hover:text-black">
              "L'élégance à fleur de peau, servie avec passion."
            </p>
          </div>

          {/* Grille des Marques (Bulles Or & Noir) */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-48 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => scrollToBrand(brand.id)}
                  className="group cursor-pointer flex flex-col items-center gap-8"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-black group-hover:border-[#C9A96E] group-hover:scale-110 transition-all duration-700 shadow-2xl relative">
                    <img
                      src={brand.image_url || 'https://via.placeholder.com/150'}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-all duration-1000"
                    />
                  </div>
                  <h3 className="text-[11px] font-black text-black text-center uppercase tracking-[0.4em] group-hover:text-[#C9A96E] transition-all">
                    {brand.name}
                  </h3>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Sections par Marque */}
          {brands.map((brand, bIdx) => {
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

            const isEven = bIdx % 2 === 0;

            return (
              <RevealOnScroll key={brand.id} delay={0.15}>
                <div
                  ref={(el) => { brandSectionRefs.current[brand.id] = el; }}
                  className={`mb-64 scroll-mt-32 p-12 md:p-24 rounded-[4rem] transition-all duration-1000 ${
                    isEven ? 'bg-white shadow-xl border border-gray-100' : 'bg-gray-900 text-white shadow-2xl'
                  }`}
                >
                  {/* Header de Marque */}
                  <div className="text-center mb-24 px-4">
                    <h2 className={`text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tighter transition-colors duration-1000 ${
                      isEven ? 'text-gray-900 hover:text-[#C9A96E]' : 'text-white hover:text-[#C9A96E]'
                    }`}>
                      {brand.name}
                    </h2>
                    <div className={`max-w-4xl mx-auto mb-12 ${isEven ? 'text-gray-600' : 'text-gray-300'}`}>
                      <p className="text-base sm:text-lg leading-relaxed">
                        {brand.description || 'Découvrez une collection raffinée de pièces qui célèbrent la féminité, le confort et l’élégance à chaque silhouette.'}
                      </p>
                    </div>
                    
                    {/* Sélecteur de Sous-catégories */}
                    {subcategories.length > 0 && (
                      <div className={`flex flex-wrap justify-center gap-10 mb-16 border-y py-8 ${
                        isEven ? 'border-gray-100' : 'border-white/10'
                      }`}>
                        {subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              setSelectedSubcategories(prev => ({ ...prev, [brand.id]: sub }));
                              setSelectedCollections(prev => {
                                const newCols = { ...prev };
                                delete newCols[`${brand.id}-${sub}`];
                                return newCols;
                              });
                            }}
                            className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-300 relative pb-2 ${
                              selectedSub === sub
                                ? 'text-[#C9A96E]'
                                : isEven ? 'text-gray-300 hover:text-black' : 'text-gray-500 hover:text-white'
                            }`}
                          >
                            {sub}
                            {selectedSub === sub && (
                              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#C9A96E] animate-pulse rounded-full"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sélecteur de Collections */}
                    {collections.length > 1 && (
                      <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {collections.map((col) => (
                          <button
                            key={col}
                            onClick={() => setSelectedCollections(prev => ({ ...prev, [`${brand.id}-${selectedSub}`]: col }))}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                              selectedCol === col
                                ? 'bg-[#C9A96E] text-white shadow-xl scale-110'
                                : isEven ? 'bg-gray-50 text-gray-400 hover:bg-black hover:text-white' : 'bg-white/5 text-gray-500 hover:bg-white hover:text-black'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Produits - NO GRAYSCALE / NO OPACITY REDUCTION */}
                  {finalProducts.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-300 italic font-serif text-2xl">Collection à venir...</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        ref={(el) => { scrollContainerRefs.current[scrollKey] = el; }}
                        className="flex overflow-x-auto gap-8 sm:gap-16 pb-16 px-2 sm:px-4 hide-scrollbar"
                        style={{ scrollSnapType: 'x mandatory' }}
                      >
                        {finalProducts.map((item, idx) => {
                          const isActive = idx === activeIndex;
                          const variant = item.variants[0];
                          return (
                            <div
                              key={item.id}
                              className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] transition-all duration-1000 ease-in-out scroll-snap-align-center ${
                                isActive ? 'scale-100' : 'scale-95'
                              }`}
                            >
                              <div
                                className={`relative overflow-hidden rounded-[3rem] group cursor-pointer shadow-2xl ${isEven ? 'bg-gray-50' : 'bg-white/5'} h-[420px] sm:h-[480px] md:h-[520px]`}
                              >
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110"
                                />
                                
                                <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-5 backdrop-blur-[2px] bg-black/5">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item, variant); }}
                                    className="bg-[#C9A96E] text-white text-[11px] font-black uppercase tracking-[0.3em] px-6 sm:px-10 py-3 sm:py-5 rounded-2xl hover:bg-black transition-all shadow-2xl transform translate-y-6 group-hover:translate-y-0 duration-700"
                                  >
                                    Panier
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}
                                    className="bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] px-6 sm:px-10 py-3 sm:py-5 rounded-2xl hover:bg-[#C9A96E] hover:text-white transition-all shadow-2xl transform translate-y-6 group-hover:translate-y-0 duration-1000"
                                  >
                                    Détails
                                  </button>
                                </div>
                              </div>
                              <div className={`mt-8 sm:mt-12 text-center transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
                                <h5 className={`text-2xl sm:text-3xl font-serif font-bold mb-4 ${isEven ? 'text-gray-900' : 'text-white'}`}>{item.name}</h5>
                                <p className="text-[10px] text-[#C9A96E] font-black uppercase tracking-[0.5em]">{selectedCol || 'Collection Exclusive'}</p>
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