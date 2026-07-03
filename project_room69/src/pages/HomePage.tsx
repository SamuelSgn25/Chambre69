import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

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
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  productImages: string[];
  features?: string[];
}

const brands: Brand[] = [
  {
    id: 1,
    name: "Ysabel Mora",
    shortDescription: "Confort haut de gamme accessible",
    fullDescription: "Marque espagnole reconnue pour son approche accessible du confort haut de gamme, Ysabel Mora propose une lingerie pensée pour accompagner le quotidien avec douceur et simplicité élégante.",
    imageUrl: "https://fr.ysabelmora.com/cdn/shop/files/10138-1-tanga-encaje-mujer-ysabel-mora-cava.jpg?v=1721119782&width=1533",
    productImages: [
      "https://fr.ysabelmora.com/cdn/shop/files/19697-4-braga-alta-adapt-invisible-mujer-ysabel-mora-negro.jpg?v=1721213702&width=2048",
      "https://fr.ysabelmora.com/cdn/shop/files/8331385BUNICO.jpg?v=1773406501&width=740",
      "https://fr.ysabelmora.com/cdn/shop/files/FOTO_05_10808_025.jpg?v=1770642272&width=1533",
    ],
    features: [
      "Confort optimal au quotidien",
      "Matières respirantes et agréables",
      "Design épuré et moderne",
      "Adaptabilité à différentes morphologies",
      "Excellent rapport qualité/prix"
    ]
  },
  {
    id: 2,
    name: "Curvy Kate",
    shortDescription: "Pour les silhouettes généreuses",
    fullDescription: "Spécialiste des silhouettes généreuses, Curvy Kate célèbre les courbes avec audace et technicité, en offrant des modèles qui allient maintien et esthétique.",
    imageUrl: "https://curvissa.scene7.com/is/image/OttoUK/600w/Curvy-Kate-Flare-Underwired-Plunge-Bra~14X463FRSP.jpg",
    productImages: [
      "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/F86250s.jpg?im=Resize,width=750",
      "https://us.brastop.com/cdn/shop/products/sc-all-night-body-ls1.jpg?v=1699618785&width=640",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgpwC8VElcpr-8lx3OgpqIQuA9sYR_532-xw&s",
    ],
    features: [
      "Maintien exceptionnel",
      "Coupes flatteuses",
      "Large gamme de tailles",
      "Design moderne et dynamique",
      "Confort longue durée"
    ]
  },
  {
    id: 3,
    name: "Dita Von Teese",
    shortDescription: "Glamour vintage",
    fullDescription: "Inspirée du glamour vintage, cette marque incarne une féminité assumée, élégante et théâtrale, avec des pièces à forte identité.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThp_jVCSMa01qPdOT46t7TzfIIHS6Xg9j7Gw&s",
    productImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrDwKCRIW5qlCqpy4POz7g7XvWg8tVM-nMow&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlxSdKzrJOAqC4WGwHB7sPvPP5DERdG27ijw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiHblGqonqrfPdKONiskCvytAEFqVhfPk1tA&s",
    ],
    features: [
      "Esthétique rétro-chic",
      "Finitions sophistiquées",
      "Pièces élégantes et audacieuses",
      "Inspiration haute couture",
      "Détails raffinés"
    ]
  },
  {
    id: 4,
    name: "Wacoal",
    shortDescription: "Innovation et élégance",
    fullDescription: "Référence mondiale, Wacoal se distingue par son expertise technique et son innovation constante au service du confort féminin.",
    imageUrl: "https://media.wacoallingerie.com/medias/Wacoal-HP-3BoxTeaser-Timelessollections-HaloLace-Black-MouldedBra-Brief-MB.jpg?context=bWFzdGVyfGltYWdlc3w0MTE0MnxpbWFnZS9qcGVnfGFEYzBMMmhqTnk4eE1ESXdNamMxT0RZME16YzBNaTlYWVdOdllXd3RTRkF0TTBKdmVGUmxZWE5sY2kxVWFXMWxiR1Z6YzI5c2JHVmpkR2x2Ym5NdFNHRnNiMHhoWTJVdFFteGhZMnN0VFc5MWJHUmxaRUp5WVMxQ2NtbGxaaTFOUWk1cWNHY3xjMTI0YmExYjQ5N2UyNjM3YzExNTA3OGRmOTJmMGZhNGE4ZWVjYTQ1ODI1OGI0MTdmZGI1NzIzNGE1OTA1MjYx",
    productImages: [
      "https://media.wacoallingerie.com/medias/Wacoal-UK-Homepage-Shapewear-3box-ShapeRevelation-Black-MB.jpg?context=bWFzdGVyfGltYWdlc3wzNTQ3OHxpbWFnZS9qcGVnfGFETXlMMmcxTkM4eE1EazVNRE16TURrek56TTNOQzlYWVdOdllXd3RWVXN0U0c5dFpYQmhaMlV0VTJoaGNHVjNaV0Z5TFROaWIzZ3RVMmhoY0dWU1pYWmxiR0YwYVc5dUxVSnNZV05yTFUxQ0xtcHdad3wxMzg3YjFhZmYxMjIxYjU5Y2Q2YTIwOTIyMmQ1MGE4NDFjNzRkNmQzMDE2Zjc2YzEwNzc0NmJiZTgzMGM0NDA3",
      "https://media.wacoallingerie.com/medias/Wacoal-UK-Editorial-WOWLandingPg-Instagram-4Box-SensuLace-Salsa-MB.jpg?context=bWFzdGVyfGltYWdlc3wzNzk4OXxpbWFnZS9qcGVnfGFHRXdMMmd5Wmk4eE1EazFNRE01T1RNMk1UQTFOQzlYWVdOdllXd3RWVXN0UldScGRHOXlhV0ZzTFZkUFYweGhibVJwYm1kUVp5MUpibk4wWVdkeVlXMHRORUp2ZUMxVFpXNXpkVXhoWTJVdFUyRnNjMkV0VFVJdWFuQm58NmYwYzg5MDg0YzNlYjc2ZTJkMzFiODlkMzc0ZmJmMzQyMThmZGM3ZGQwYjgwYTU0YjliYjI2MTAyYmU0Mjk3Mg",
      "https://www.whatgirlswant.ca/assets/images/wacoal%20visual%20effects%20bodysuit%20with%20minimizer%20bra%20-%20full%20picture%20-%20sand.jpg",
    ],
    features: [
      "Technologie avancée",
      "Ajustement précis",
      "Maintien irréprochable",
      "Confort ergonomique",
      "Design élégant et discret"
    ]
  },
  {
    id: 5,
    name: "Elomi",
    shortDescription: "Pour les courbes",
    fullDescription: "Pensée pour les courbes, Elomi offre une lingerie performante et élégante qui valorise chaque silhouette avec assurance.",
    imageUrl: "https://media.elomilingerie.com/medias/Elomi-UK-Homepage-3BoxComponent-Lingerie-October-25-MB.jpg?context=bWFzdGVyfGltYWdlc3w2OTcyNXxpbWFnZS9qcGVnfGFETTVMMmhpTUM4eE1EZ3dOamt4TWpJMU16azRNaTlGYkc5dGFTMVZTeTFJYjIxbGNHRm5aUzB6UW05NFEyOXRjRzl1Wlc1MExVeHBibWRsY21sbExVOWpkRzlpWlhJdE1qVXRUVUl1YW5CbnxiNTRiM2JlY2RmMjM0OTNkMTQ1NjhiZTZhYzIzNWZkMzAxYjlmYjEyODNkZjgxMDA3ZjczOTRkYjY1ZjgwZjMx",
    productImages: [
      "https://lookagain.scene7.com/is/image/OttoUK/600w/Matilda-Underwired-Plunge-Bra-by-Elomi~96E625FRSP.jpg",
      "https://media.elomilingerie.com/medias/Elomi-UK-NewSeason-AW25-Swim-Montage-2Box-MB.jpg?context=bWFzdGVyfGltYWdlc3w0MTE1MnxpbWFnZS9qcGVnfGFEaGxMMmd3WWk4eE1EYzROelUzTURnME16WTNPQzlGYkc5dGFTMVZTeTFPWlhkVFpXRnpiMjR0UVZjeU5TMVRkMmx0TFUxdmJuUmhaMlV0TWtKdmVDMU5RaTVxY0djfDg2Yzk5NmI5YzEwMjU4MzM5ZTE0ZDdmYjFmNWU1N2FhYTY4MmVjOTUzMGQ0YmUxMDM2ZWJlMDFkODI5MzEzOTE",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYsg4TxWgEOxPSch22bcnlTGsoMOhxOloCZA&s",
    ],
    features: [
      "Confort supérieur",
      "Maintien optimal",
      "Adapté aux fortes poitrines",
      "Design moderne",
      "Structure renforcée"
    ]
  },
  {
    id: 6,
    name: "Fantasie",
    shortDescription: "Élégance intemporelle",
    fullDescription: "Fantasie incarne une élégance intemporelle avec des collections raffinées et délicates adaptées au quotidien.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwuTCGuELsne65cNF2oM2ISJ-DpN7OUFS7A&s",
    productImages: [
      "https://media.fantasie.com/medias/Fantasie-UK-Swimsuits-M.jpg?context=bWFzdGVyfGltYWdlc3w3MTE4NXxpbWFnZS9qcGVnfGFETTBMMmhtTmk4eE1EazNNVGs1T0RrM09EQTNPQzlHWVc1MFlYTnBaUzFWU3kxVGQybHRjM1ZwZEhNdFRTNXFjR2N8Njk1NDQ5ODdhOTkyM2M4NzI0Y2Y0NzE5YTk0MzlhZDhiOWU1OWYwZTc5MjBlMDQ1NWUzMjQ4NjFiMTNkMDMwMQ",
      "https://media.fantasie.com/medias/FL2985-BLK-cons-Fantasie-Lingerie-Illusion-Black-Brief.jpg-480x672-pdp-mobile?context=bWFzdGVyfHByb2R1Y3RJbWFnZXN8NjY2MDJ8aW1hZ2UvanBlZ3xhVzFoWjJWekwzQnliMlIxWTNSekwyZzNZaTlvT0RZdk9UVXlNVGM0TkRBMk1UazRNaTVxY0djfDU0NGUzNDlhZDA2ZjBjN2E2NDZiY2I0NjFlYmM5NzIwMTZjYTc4MTNlM2M1OGNkMmQ1NjBmNmY5MTcwY2I5ZDU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoNAs0RqxWv11PQuk-zh2qp16YCcNNq9NaGQ&s",
    ],
    features: [
      "Designs sophistiqués",
      "Finitions délicates",
      "Confort durable",
      "Maintien naturel",
      "Styles variés"
    ]
  },
  {
    id: 7,
    name: "Miraclesuit",
    shortDescription: "Effet sculptant immédiat",
    fullDescription: "Spécialiste du gainant, Miraclesuit propose des pièces sculptantes qui redessinent la silhouette avec élégance.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCU2D5u7rfRQwKMznby1oSK2rmrPboA1V2Q&s",
    productImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoSolLQQKGBxswqDWgcdyPN9-6rWYjaxIRNw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGLgrCiwGFWIciZ01meQHv7IF-vWwzP10Yg&s",
      "https://m.media-amazon.com/images/I/51f9FyE3OJL.jpg"
    ],
    features: [
      "Effet sculptant immédiat",
      "Technologie gainante",
      "Confort en mouvement",
      "Coupe valorisante",
      "Résistance des matières"
    ]
  },
  {
    id: 8,
    name: "Empreinte",
    shortDescription: "Luxe et savoir-faire français",
    fullDescription: "Symbole de luxe et de savoir-faire français, Empreinte propose une lingerie d’exception, à la fois technique et esthétique.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTLLKmvV5L-CzYBk8ZUywclRVaGoPSOeDoEw&s",
    productImages: [
      "https://cdn.shoplightspeed.com/shops/618963/files/43324509/1652x2313x1/empreinte-soutien-gorge-empreinte-louise-08184.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR8XSlcOM9vzJV4s_-f4cgEL0JmI4VYH1HqA&s",
      "https://cdn.shopify.com/s/files/1/0614/4976/5033/files/CASSIOPEE_NOIR_2024_CMYK_HR_480x480.jpg?v=1724335339"
    ],
    features: [
      "Finitions luxueuses",
      "Maintien exceptionnel",
      "Broderies raffinées",
      "Confort haut de gamme",
      "Durabilité remarquable"
    ]
  },
  {
    id: 9,
    name: "Louisa Bracq",
    shortDescription: "Lingerie œuvre d'art",
    fullDescription: "Marque artistique et créative, Louisa Bracq transforme la lingerie en véritable expression esthétique.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqA17aUpd9dj9oFKlQWmbzd3Z2p88yDJhf9w&s",
    productImages: [
      "https://images.squarespace-cdn.com/content/v1/5b99233785ede1ce2ff573b2/1741800219342-LTBKNZVFK6ESLE89K4AA/louisa-bracq-tweegy.jpg?format=1000w",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR09AYudF27cXFpO-u0L0pMDD25vNBR5I0rWg&s",
      "https://louisabracq.com/9802-large_default/julia-body-louisabracq.jpg"
    ],
    features: [
      "Broderies uniques",
      "Créations originales",
      "Style audacieux",
      "Détails travaillés",
      "Identité forte"
    ]
  },
  {
    id: 10,
    name: "LingaDore",
    shortDescription: "Tendance et confort",
    fullDescription: "Moderne et séduisante, LingaDore allie tendance et confort pour une lingerie actuelle et accessible.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZhx4T3GlElqyjU6Jl_DFGHeKX8pJepZamjw&s",
    productImages: [
      "https://img01.ztat.net/article/spp-media-p1/6a9dd56867dd4ef092b0cd92dacb007b/147eb6accc5948b8bbb8f6f0ae287942.jpg?imwidth=762",
      "https://cdn.laredoute.com/cdn-cgi/image/width=400,height=400,fit=pad,dpr=1/products/5/9/7/597dd6ff4cd726581819b64ea955a8bc.jpg",
      "https://img01.ztat.net/article/spp-media-p1/6356c000c9a738f7ab7c92cae29ba34c/d8932c05c8d143a59b7dedcce0ddfb2f.jpg?imwidth=1800"
    ],
    features: [
      "Design contemporain",
      "Confort optimal",
      "Style séduisant",
      "Polyvalence des collections",
      "Bon équilibre qualité/prix"
    ]
  }
];

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<(Product & { variant: ProductVariant })[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/products?featured=true`);
        const data = await response.json();
        setFeaturedProducts(data.map((p: any) => ({
          ...p,
          variant: p.variants[0]
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
  }, [brands]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FadeInOnLoad>
        <section className="relative min-h-screen flex items-stretch overflow-hidden gap-6 md:gap-8 p-6 md:p-8">
          <div className="w-1/2 rounded-2xl shadow-2xl overflow-hidden">
            <img
              src="https://i0.wp.com/www.youreleganceshop.com/wp-content/uploads/2025/01/ensemble-lingerie-5-pieces-sexy.png?fit=1136%2C1512&ssl=1"
              alt="Lingerie élégante"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/2 bg-black border-2 border-[#C9A96E] rounded-2xl shadow-2xl flex items-start justify-center p-8">
            <div className="text-center max-w-lg mx-auto pt-12 md:pt-16 breathe">
              <h1 className="font-bold text-5xl md:text-7xl tracking-tight text-[#C9A96E] mb-6 leading-tight">
                Découvrez l'univers de<br />Chambre69
              </h1>
              <p className="text-lg md:text-xl text-[#C9A96E]/80 mb-8 font-light">
                Découvrez notre collection de lingerie haut de gamme, conçue pour sublimer votre beauté naturelle
              </p>
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#C9A96E] text-black px-10 py-4 text-sm tracking-wide rounded-full shadow-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 font-medium"
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
              {brands.map((brand, idx) => {
                const isActive = idx === activeBrandIndex;
                return (
                  <div
                    key={brand.id}
                    className={`flex-shrink-0 transition-all duration-500 ${isActive ? 'scale-105 z-10' : 'scale-95 opacity-70'}`}
                    style={{ width: '260px' }}
                  >
                    <div className="relative bg-gray-100 overflow-hidden rounded-lg group cursor-pointer">
                      <img src={brand.imageUrl} alt={brand.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" onClick={() => setSelectedBrand(brand)} />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className={`text-base font-medium mb-2 transition-colors ${isActive ? 'text-[#C9A96E]' : 'text-gray-900 group-hover:text-[#C9A96E]'}`}>
                        {brand.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">{brand.shortDescription}</p>
                      <button onClick={() => setSelectedBrand(brand)} className="bg-black text-white px-4 py-1.5 text-xs rounded-full hover:bg-[#C9A96E] transition-colors">
                        Découvrir la marque
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
                onClick={() => window.open('https://wa.me/33123456789?text=Bonjour, je souhaite passer une commande', '_blank')}
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