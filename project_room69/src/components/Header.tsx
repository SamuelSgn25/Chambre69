import { Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo-chambre69.png';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleWhatsApp = () => {
    window.open('https://wa.me/221787040505', '_blank');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('shop');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black shadow-2xl z-50 border-b border-[#C9A96E]/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Première ligne : [search|accueil] | logo | icônes */}
        <div className="flex items-center h-20 sm:h-24 gap-2">

          {/* Colonne gauche : bouton Accueil (mobile) ou barre de recherche (desktop) */}
          <div className="flex items-center min-w-0 flex-shrink-0 md:flex-1">
            {/* Accueil visible uniquement sur mobile */}
            <button
              onClick={() => onNavigate('home')}
              className="md:hidden flex flex-col items-center text-[#C9A96E] hover:text-white transition-colors"
              aria-label="Accueil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Accueil</span>
            </button>
            {/* Recherche visible uniquement sur desktop */}
            <form onSubmit={handleSearch} className="relative max-w-xs hidden md:block w-full">
              <input
                type="text"
                name="search"
                placeholder="Rechercher..."
                className="w-full border-b border-[#C9A96E]/30 py-2 pr-8 text-white placeholder-gray-500 bg-transparent focus:outline-none focus:border-[#C9A96E] transition-colors text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#C9A96E] hover:text-white transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Logo centré */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="focus:outline-none cursor-pointer group"
              aria-label="Accueil"
            >
              <img
                src={logo}
                alt="Chambre 69"
                className="w-[130px] sm:w-[180px] md:w-[220px] h-auto transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const h1 = document.createElement('h1');
                    h1.className = "text-xl font-serif font-bold text-white";
                    h1.innerText = "CHAMBRE 69";
                    parent.appendChild(h1);
                  }
                }}
              />
            </button>
          </div>

          {/* Icônes à droite */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 flex-shrink-0 md:flex-1">
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex flex-col items-center text-[#C9A96E] hover:text-white transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1 hidden sm:block">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A96E] text-black text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center text-[#C9A96E] hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1 hidden sm:block">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Navigation — masquée sur mobile */}
        <nav className="hidden md:flex items-center justify-center space-x-12 pb-4">
          {['home', 'shop', 'about', 'contact'].map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative pb-1 whitespace-nowrap ${
                currentPage === page
                  ? 'text-white'
                  : 'text-[#C9A96E] hover:text-white'
              }`}
            >
              {page === 'home' ? 'Accueil' : page === 'shop' ? 'Visite de la Boutique' : page === 'about' ? 'À propos' : 'Contact'}
              {currentPage === page && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A96E]"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Navigation mobile */}
        <nav className="md:hidden flex items-center justify-around pb-3 border-t border-[#C9A96E]/10 pt-2">
          {['shop', 'about', 'contact'].map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 relative pb-1 whitespace-nowrap ${
                currentPage === page
                  ? 'text-white'
                  : 'text-[#C9A96E]'
              }`}
            >
              {page === 'shop' ? 'Visite de la Boutique' : page === 'about' ? 'À propos' : 'Contact'}
              {currentPage === page && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A96E]"></span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
