import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('chambre69-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('chambre69-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variant: ProductVariant, size: string) => {
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
