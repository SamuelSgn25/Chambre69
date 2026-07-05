import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'product') {
      navigate(`/product/${data.slug}`);
    } else {
      navigate(`/${page === 'home' ? '' : page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header
          onNavigate={handleNavigate}
          currentPage={location.pathname.substring(1) || 'home'}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/shop" element={<ShopPage onNavigate={handleNavigate} />} />
            <Route path="/product/:slug" element={<ProductPage onNavigate={handleNavigate} />} />
            <Route path="/cart" element={<CartPage onNavigate={handleNavigate} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </CartProvider>
  );
}

export default App;
