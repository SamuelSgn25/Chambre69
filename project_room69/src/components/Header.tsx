import { Search, User, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user: any;
  onLogout: () => void;
}

export const Header = ({ onNavigate, currentPage, user, onLogout }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleWhatsApp = () => {
    window.open('https://wa.me/22900000000', '_blank');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('search') as HTMLInputElement).value.trim();
    if (query) {
      onNavigate(`shop`);
    } else {
      onNavigate('shop');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Première ligne : recherche | logo | icônes */}
        <div className="flex items-center justify-between h-24">
          {/* Recherche */}
          <div className="flex-1 hidden md:block">
            <form onSubmit={handleSearch} className="relative max-w-xs">
              <input
                type="text"
                name="search"
                placeholder="Rechercher..."
                className="w-full border-b border-gray-200 py-2 pr-8 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#C9A96E] transition-colors text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A96E] transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Logo centré */}
          <div className="flex-1 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="focus:outline-none cursor-pointer group"
              aria-label="Accueil"
            >
              <h1 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-[#C9A96E] transition-colors">CHAMBRE 69</h1>
              <p className="text-[8px] tracking-[0.4em] text-gray-400 uppercase -mt-1">Paris • Lingerie</p>
            </button>
          </div>

          {/* Icônes à droite */}
          <div className="flex-1 flex items-center justify-end space-x-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{user.name || 'Mon Compte'}</span>
                  <button onClick={onLogout} className="text-[8px] text-gray-400 hover:text-red-500 uppercase tracking-widest">Déconnexion</button>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#C9A96E]" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex flex-col items-center text-gray-400 hover:text-[#C9A96E] transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Connexion</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('cart')}
              className="relative flex flex-col items-center text-gray-400 hover:text-[#C9A96E] transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-12 pb-4">
          {['home', 'shop', 'about', 'contact'].map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative pb-1 ${
                currentPage === page
                  ? 'text-black'
                  : 'text-gray-400 hover:text-[#C9A96E]'
              }`}
            >
              {page === 'home' ? 'Accueil' : page === 'shop' ? 'Boutique' : page === 'about' ? 'À propos' : 'Contact'}
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
  );
};