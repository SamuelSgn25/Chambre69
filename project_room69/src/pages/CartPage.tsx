import { useCart } from '../context/CartContext';
import { MessageCircle, Trash2, Minus, Plus } from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage = ({ onNavigate }: CartPageProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleWhatsAppCheckout = () => {
    let message = 'Bonjour, je souhaite commander les articles suivants :\n\n';

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Couleur: ${item.variant.color}\n`;
      message += `   Taille: ${item.selectedSize}\n`;
      message += `   Quantité: ${item.quantity}\n\n`;
    });

    message += 'Pouvez-vous me confirmer leur disponibilité ?';

    window.open(`https://wa.me/221787040505?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-light mb-6 text-gray-900">Panier</h1>
          <p className="text-gray-600 mb-8">Votre panier est vide</p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#111111] text-white px-8 py-3 text-sm tracking-wide hover:bg-[#C9A96E] transition-colors"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-light text-gray-900">Panier</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Vider le panier
          </button>
        </div>

        <div className="bg-white p-6 mb-6">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.variant.id}-${item.selectedSize}`}
              className="flex gap-6 py-6 border-b last:border-b-0"
            >
              <div className="w-32 h-32 flex-shrink-0 bg-gray-100">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Couleur: {item.variant.color}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Taille: {item.selectedSize}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.variant.id, item.selectedSize, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.variant.id, item.selectedSize, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.variant.id, item.selectedSize)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Total articles: {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>

          <button
            onClick={handleWhatsAppCheckout}
            className="w-full px-8 py-4 text-sm tracking-wide inline-flex items-center justify-center gap-2 transition-colors bg-[#25D366] text-white hover:bg-[#20BD5A]"
          >
            <MessageCircle className="h-5 w-5" />
            Commander via WhatsApp
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="w-full mt-3 bg-white border border-[#111111] text-[#111111] px-8 py-4 text-sm tracking-wide hover:bg-gray-50 transition-colors"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};
