import { useState } from 'react';
import { API_URL } from '../config';

interface AuthPageProps {
  onAuthSuccess: (user: any, token: string) => void;
  onNavigate: (page: string) => void;
}

export const AuthPage = ({ onAuthSuccess, onNavigate }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      onAuthSuccess(data.user, data.token);
      onNavigate('shop');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] relative overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C9A96E]/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A96E]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Chambre 69</h1>
          <p className="text-gray-400 text-sm italic">"L'élégance à fleur de peau"</p>
        </div>

        {/* Glassmorphic Form */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent opacity-30"></div>
          
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 text-center">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Nom Complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C9A96E] transition-all"
                  placeholder="Ex: Sarah Martin"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C9A96E] transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#C9A96E] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center italic">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-[#C9A96E] transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se Connecter' : 'S\'inscrire')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#C9A96E] transition-colors"
            >
              {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
