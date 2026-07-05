import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  care_instructions?: string;
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

interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, size: string) => void;
  removeFromCart: (productId: string, variantId: string, size: string) => void;
  updateQuantity: (productId: string, variantId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, user }: { children: ReactNode; user: any }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('chambre69-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('chambre69-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (showAuthAlert) {
      const timer = setTimeout(() => {
        setShowAuthAlert(false);
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAuthAlert, navigate]);

  const addToCart = (product: Product, variant: ProductVariant, size: string) => {
    if (!user) {
      setShowAuthAlert(true);
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.product.id === product.id &&
                item.variant.id === variant.id &&
                item.selectedSize === size
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id &&
          item.variant.id === variant.id &&
          item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { product, variant, quantity: 1, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string, variantId: string, size: string) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.product.id === productId &&
                  item.variant.id === variantId &&
                  item.selectedSize === size)
      )
    );
  };

  const updateQuantity = (productId: string, variantId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId, size);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId &&
        item.variant.id === variantId &&
        item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems }}>
      {children}

      {showAuthAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop avec flou */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300" onClick={() => setShowAuthAlert(false)} />
          
          {/* Modal Card */}
          <div className="relative bg-black border border-[#C9A96E]/40 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden transform transition-all duration-500 scale-100 breathe">
            {/* Décoration d'arrière-plan */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#C9A96E]/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#C9A96E]/10 rounded-full blur-xl animate-pulse" />
            
            {/* Icône dorée animée */}
            <div className="mx-auto w-16 h-16 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mb-6">
              <Lock className="h-6 w-6 text-[#C9A96E]" />
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-[#C9A96E] mb-4 tracking-wide">
              Connexion Requise
            </h3>
            
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Pour ajouter des articles au panier, veuillez vous connecter à votre compte <span className="text-[#C9A96E] font-semibold">Chambre69</span>.
            </p>
            
            <p className="text-xs text-gray-500 italic mb-2">
              Redirection automatique dans 3 secondes...
            </p>
            
            {/* Barre de progression */}
            <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-[#C9A96E] rounded-full animate-progress"
              />
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
