import { useState } from 'react';
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
import { AuthPage } from './pages/AuthPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'product') {
      navigate(`/product/${data.slug}`);
    } else {
      navigate(`/${page === 'home' ? '' : page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (userData: any, userToken: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <CartProvider user={user}>
      <div className="min-h-screen flex flex-col bg-white">
        <Header 
          onNavigate={handleNavigate} 
          currentPage={location.pathname.substring(1) || 'home'} 
          user={user} 
          onLogout={handleLogout} 
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/shop" element={<ShopPage onNavigate={handleNavigate} />} />
            <Route path="/product/:slug" element={<ProductPage onNavigate={handleNavigate} />} />
            <Route path="/cart" element={<CartPage onNavigate={handleNavigate} user={user} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage onAuthSuccess={handleAuthSuccess} onNavigate={handleNavigate} />} />
            <Route path="/register" element={<AuthPage onAuthSuccess={handleAuthSuccess} onNavigate={handleNavigate} />} />
          </Routes>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </CartProvider>
  );
}

export default App;
